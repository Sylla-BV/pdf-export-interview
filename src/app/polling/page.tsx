"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, FileDown, AlertCircle, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import { usePdfExport } from "@/hooks/use-pdf-export"

export default function PollingPage() {
  const { requestPdfExport, downloadUrl, isLoading, isExpired, expiresIn, error } = usePdfExport("polling")

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Link 
        href="/" 
        className="flex items-center text-sm text-white/80 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-white">Polling PDF Export</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-red-400/30">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          {downloadUrl && !isExpired && (
            <div className="p-4 rounded-md bg-green-900/20 border border-green-800/50">
              <p className="text-sm text-green-100 mb-2">Your PDF export is ready!</p>
              <p className="text-xs text-green-300/80 mb-4">Link expires in {expiresIn} seconds</p>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white py-2 px-4 rounded-md transition-all"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </div>
          )}

          {downloadUrl && isExpired && (
            <Alert className="bg-white border-amber-300">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700 font-medium">
                Link expired
              </AlertTitle>
              <AlertDescription className="text-amber-600">
                The download link has expired. Please generate a new export.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={requestPdfExport} 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Generate PDF Export"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
