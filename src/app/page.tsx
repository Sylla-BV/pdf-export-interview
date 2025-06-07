import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Clock, Zap } from "lucide-react";

export default function Home() {
  return (
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back!</h1>
          <span className="hidden text-4xl font-bold text-white mb-2">Boss :)</span>
          <p className="text-lg text-blue-100 text-center mx-auto">
            For event-driven file generation in web applications, there are three common approaches: 
            <br />
            <strong>Polling</strong>, <strong>Server-Sent Events (SSE)</strong>, and <strong>WebSockets</strong>.
            <br />
            I&apos;ve implemented the first two solutions for comparison. 
            While WebSockets would work, it will add unnecessary complexity for this use case. 
            Feel free to test both available methods below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardHeader className="flex flex-row items-center space-x-3">
              <Clock className="w-6 h-6 text-blue-300" />
              <h2 className="text-xl font-semibold text-white">Polling Method</h2>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-200">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <p>Simple implementation and maintenance</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p>More load on server with requests (every 2s)</p>
              </div>
              <p className="text-sm text-gray-300">
                Traditional approach that checks the server at regular intervals.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Link href="/polling">Try Polling Method</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 relative">
            <div className="absolute top-3 right-3 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Recommended
            </div>
            <CardHeader className="flex flex-row items-center space-x-3">
              <Zap className="w-6 h-6 text-green-300" />
              <h2 className="text-xl font-semibold text-white">SSE Method</h2>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-200">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <p>Real-time updates with server-sent events</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p>More complex implementation</p>
              </div>
              <p className="text-sm text-gray-300">
                Modern approach using a persistent connection for instant notifications.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Link href="/sse">Try SSE Method</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <p className="text-center text-sm text-white/60">
          Both methods are fully implemented and ready for testing.
        </p>
      </div>
  );
}
