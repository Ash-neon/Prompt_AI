import Link from "next/link";
import { ArrowUpRight, Check, Sparkles, Zap } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                AI-Powered Prompt Engineering
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Transform{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Basic Queries
              </span>{" "}
              into Expert Prompts
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Enhance your ChatGPT experience with our intelligent prompt
              engineering extension. Get better responses with structured,
              high-quality prompts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
              >
                Try It Free
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#pricing"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                View Pricing
              </Link>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Works with ChatGPT</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Instant prompt enhancement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
