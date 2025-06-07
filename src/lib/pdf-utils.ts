import { v4 as uuidv4 } from "uuid"
import { sign } from "jsonwebtoken"

// Generate a temporary URL that will expire in 120 seconds
export function generateTempUrl(sourceUrl: string) {
  // Create a token that will expire in 120 seconds
  const token = sign({ sourceUrl, id: uuidv4() }, process.env.JWT_SECRET || "pdf-export-secret", { expiresIn: "120s" })

  // Calculate the expiration time
  const expiresAt = new Date(Date.now() + 120 * 1000)

  // Create a temporary URL that includes the token
  const tempUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/pdf-exports/download?token=${token}`

  return { tempUrl, expiresAt }
}
