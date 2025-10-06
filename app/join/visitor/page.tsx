"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Hammer, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function JoinAsVisitorPage() {
  const router = useRouter();

  const handleContinueAsVisitor = () => {
    // In production, this might set some visitor preferences
    router.push("/visitor");
  };

  const handleExplore = () => {
    router.push("/explore");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center text-[#A26A5E] hover:text-[#8B5A4E] mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome, Art Enthusiast! 🎨
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover incredible street art from talented artists around the
            world. No account needed to explore!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Browse as Visitor</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start exploring immediately without signing up
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-[#A26A5E] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Browse Artworks</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Explore thousands of street art pieces
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-[#A26A5E] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Discover Artists</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Find talented artists from around the globe
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Hammer className="w-5 h-5 text-[#A26A5E] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Participate in Auctions</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bid on exclusive pieces in live auctions
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleContinueAsVisitor}
                className="w-full bg-[#A26A5E] hover:bg-[#8B5A4E]"
              >
                Continue as Visitor
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Explore Gallery</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Jump straight into the art collection
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-[#A26A5E] to-[#D54C2E] rounded-lg flex items-center justify-center text-white text-6xl">
                🎨
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse our curated collection of street art, filter by style,
                location, and price, and find the perfect piece for you.
              </p>

              <Button
                onClick={handleExplore}
                variant="outline"
                className="w-full border-2 border-[#A26A5E] text-[#A26A5E] hover:bg-[#A26A5E] hover:text-white bg-transparent"
              >
                Explore All Artworks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-[#A26A5E] mb-1">
                2,500+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Artists
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-[#A26A5E] mb-1">
                15,000+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Artworks
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-[#A26A5E] mb-1">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Countries
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-[#A26A5E] mb-1">$2M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Sales
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
