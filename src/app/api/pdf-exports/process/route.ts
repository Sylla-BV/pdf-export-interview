import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { pdfExports } from "@/db/schema"
import { eq } from "drizzle-orm"
import { generateTempUrl } from "@/lib/pdf-utils"

// This endpoint is called by QStash
export async function POST(request: NextRequest) {
  try {
    const { exportId } = await request.json()

    // Simulate processing time (1-3 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Source URL (the one provided in the assignment)
    const sourceUrl =
      "https://sylla-dev-public-bucket.s3.eu-central-1.amazonaws.com/books/47f4cad9aa3c005ce22fbdef05545308495bd571c55e02f7ae69353ac831d787"

    // Generate a temporary URL that will expire in 120 seconds
    const { tempUrl, expiresAt } = generateTempUrl(sourceUrl)

    // Update the database with the processed PDF export using Drizzle
    await db
      .update(pdfExports)
      .set({
        status: "ready",
        sourceUrl,
        tempUrl,
        expiresAt,
      })
      .where(eq(pdfExports.id, exportId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing PDF export:", error)

    // Update the database with the error
    if (request.body) {
      const { exportId } = await request.json()

      await db
        .update(pdfExports)
        .set({
          status: "error",
          error: "Failed to process PDF export",
        })
        .where(eq(pdfExports.id, exportId))
    }

    return NextResponse.json({ error: "Failed to process PDF export" }, { status: 500 })
  }
}
