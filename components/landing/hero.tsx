"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#A26A5E] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-8">
            <Sparkles className="w-4 h-4 text-[#A26A5E]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Empowering Street Artists Worldwide
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Where Street Art
            <br />
            <span className="text-[#A26A5E]">Meets Digital Canvas</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Track your income, showcase your masterpieces, and gain global
            visibility. Join thousands of street artists transforming their
            passion into a thriving career.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => router.push("/join/artist")}
              className="bg-[#A26A5E] hover:bg-[#8B5A4E] text-white px-8 py-6 text-lg rounded-full shadow-xl"
            >
              Join as Artist
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => router.push("/explore")}
              variant="outline"
              className="border-2 border-[#A26A5E] text-[#A26A5E] hover:bg-[#A26A5E] hover:text-white px-8 py-6 text-lg rounded-full"
            >
              Explore Art
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#A26A5E] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-[#A26A5E]" />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">
                Track Your Growth
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Monitor sales, views, and income with real-time analytics
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#A26A5E] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-[#A26A5E]" />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">
                Global Reach
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Connect with collectors and enthusiasts worldwide
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#A26A5E] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-[#A26A5E]" />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">
                Live Auctions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Participate in dynamic bidding for exclusive pieces
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
