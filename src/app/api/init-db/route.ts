import { NextResponse } from "next/server"
import { runMigrations } from "@/db/migrate"

// This endpoint is used to initialize the database
// Have a static token to prevent unauthorized access
const INIT_DB_TOKEN = process.env.INIT_DB_TOKEN || "token-jorge-init-db";

export async function GET( request: Request) {
  const token = request.headers.get("Authorization")
  if (token !== INIT_DB_TOKEN || !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await runMigrations()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
  }
}
