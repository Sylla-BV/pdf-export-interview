import type { NextRequest } from "next/server"
import { db } from "@/db"
import { pdfExports } from "@/db/schema"
import { eq } from "drizzle-orm"

// This endpoint is used for Server-Sent Events
export async function GET(request: NextRequest) {
  const exportId = request.nextUrl.searchParams.get("exportId")

  if (!exportId) {
    return new Response("Export ID is required", { status: 400 })
  }

  // Set up SSE headers
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Function to check the status of the export
      const checkStatus = async () => {
        try {
          const result = await db.select().from(pdfExports).where(eq(pdfExports.id, exportId)).limit(1)

          if (result.length === 0) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ status: "error", error: "PDF export not found" })}\n\n`),
            )
            controller.close()
            return
          }

          const pdfExport = result[0]

          if (pdfExport.status === "ready") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(pdfExport)}\n\n`))
            controller.close()
            return
          } else if (pdfExport.status === "error") {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ status: "error", error: pdfExport.error })}\n\n`),
            )
            controller.close()
            return
          }

          // Keep the connection open and check again in 1 second
          setTimeout(checkStatus, 1000)
        } catch (error) {
          console.error("Error checking PDF export status:", error)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ status: "error", error: "Failed to check export status" })}\n\n`),
          )
          controller.close()
        }
      }

      // Start checking the status
      checkStatus()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
