import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { pdfExports } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { id: exportId } = { id: request.nextUrl.pathname.split("/").pop() as string }

    // Get the export from the database using Drizzle
    const result = await db.select().from(pdfExports).where(eq(pdfExports.id, exportId)).limit(1)

    if (result.length === 0) {
      return NextResponse.json({ error: "PDF export not found" }, { status: 404 })
    }

    const pdfExport = result[0]

    return NextResponse.json(pdfExport)
  } catch (error) {
    console.error("Error fetching PDF export:", error)
    return NextResponse.json({ error: "Failed to fetch PDF export" }, { status: 500 })
  }
}
