import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Verify the token
    const decoded = verify(token, process.env.JWT_SECRET || "pdf-export-secret") as {
      sourceUrl: string
    }

    // Proxy the request to hide the source URL
    const response = await fetch(decoded.sourceUrl)
    const blob = await response.blob()
    const headers = new Headers(response.headers)
    return new NextResponse(blob, {
      status: response.status,
      headers,
    })
  } catch (error) {
    console.error("Error downloading PDF:", error)

    // If the token is invalid or expired
    return NextResponse.json({ error: "Invalid or expired download link" }, { status: 401 })
  }
}
