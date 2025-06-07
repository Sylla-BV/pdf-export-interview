"use client"

import { useState, useEffect, useCallback } from "react"

type ExportMethod = "polling" | "sse"

export function usePdfExport(method: ExportMethod) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [expiresIn, setExpiresIn] = useState(120)
  const [exportId, setExportId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Handle countdown timer for expiration
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (downloadUrl && !isExpired && expiresIn > 0) {
      timer = setInterval(() => {
        setExpiresIn((prev) => {
          if (prev <= 1) {
            setIsExpired(true)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [downloadUrl, isExpired, expiresIn])

  // Polling implementation
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout

    if (method === "polling" && exportId && isLoading) {
      pollingInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/pdf-exports/${exportId}`)
          const data = await response.json()

          if (data.status === "ready" && data.tempUrl) {
            setDownloadUrl(data.tempUrl)
            setIsLoading(false)
            setExpiresIn(Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000))
            clearInterval(pollingInterval)
          } else if (data.status === "error") {
            setError(data.error || "An error occurred while processing your request")
            setIsLoading(false)
            clearInterval(pollingInterval)
          }
        } catch {
          setError("Failed to check export status")
          setIsLoading(false)
          clearInterval(pollingInterval)
        }
      }, 2000)
    }

    return () => {
      if (pollingInterval) clearInterval(pollingInterval)
    }
  }, [method, exportId, isLoading])

  // SSE implementation
  useEffect(() => {
    if (method === "sse" && exportId && isLoading) {
      const sse = new EventSource(`/api/pdf-exports/sse?exportId=${exportId}`)

      sse.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.status === "ready" && data.tempUrl) {
          setDownloadUrl(data.tempUrl)
          setIsLoading(false)
          setExpiresIn(Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000))
          sse.close()
        } else if (data.status === "error") {
          setError(data.error || "An error occurred while processing your request")
          setIsLoading(false)
          sse.close()
        }
      }

      sse.onerror = () => {
        setError("Connection to server lost")
        setIsLoading(false)
        sse.close()
      }

      return () => {
        sse.close();
      }
    }
  }, [method, exportId, isLoading])

  const requestPdfExport = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      setDownloadUrl(null)
      setIsExpired(false)
      setExpiresIn(120)

      const response = await fetch("/api/pdf-exports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ method }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to request PDF export")
      }

      setExportId(data.id)

      // For SSE, we'll wait for the server to push updates
      // For polling, we'll start checking in the useEffect above
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
    }
  }, [method])

  return {
    requestPdfExport,
    downloadUrl,
    isLoading,
    isExpired,
    expiresIn,
    error,
  }
}
