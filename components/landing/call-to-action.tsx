"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export function CallToAction() {
  const router = useRouter();

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-[#A26A5E] to-[#8B5A4E] rounded-3xl p-12 lg:p-16 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48" />

          <div className="relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Ready to Showcase Your Art?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join our vibrant community of street artists and collectors.
                Start your journey today and turn your passion into profit.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push("/join/artist")}
                  className="bg-white text-[#A26A5E] hover:bg-gray-100 px-8 py-6 text-lg rounded-full font-bold"
                >
                  <Palette className="mr-2 w-5 h-5" />
                  Become an Artist
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  onClick={() => router.push("/join/visitor")}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full font-bold"
                >
                  <Users className="mr-2 w-5 h-5" />
                  Explore as Visitor
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">2,500+</div>
                <div className="text-white/80">Active Artists</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">15,000+</div>
                <div className="text-white/80">Artworks Listed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">$2M+</div>
                <div className="text-white/80">Total Sales</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
