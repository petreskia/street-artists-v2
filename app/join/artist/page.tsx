"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Palette, ArrowLeft } from "lucide-react";
import { setArtist } from "@/lib/utils/global";
import { getItems } from "@/lib/data";
import Link from "next/link";

export default function JoinAsArtistPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    city: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);

  // Get list of existing artists for demo purposes
  const existingArtists = Array.from(
    new Set(getItems().map((item) => item.artist))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In production, this would call your API to create the artist
      // For now, we'll simulate the signup

      // Set the artist in localStorage
      setArtist(formData.name);

      // Redirect to artist dashboard
      setTimeout(() => {
        router.push("/artist");
      }, 500);
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (artistName: string) => {
    setArtist(artistName);
    router.push("/artist");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-[#A26A5E] hover:text-[#8B5A4E] mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sign Up Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-12 h-12 bg-[#A26A5E] rounded-full flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Join as Artist</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create your profile and start showcasing your work
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Artist Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your artistic name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="artist@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Tell us about your art and style..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      placeholder="USA"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#A26A5E] hover:bg-[#8B5A4E]"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Artist Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Login for Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quick Login (Demo)</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Login as an existing artist to explore the dashboard
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {existingArtists.map((artist) => (
                  <Button
                    key={artist}
                    onClick={() => handleQuickLogin(artist)}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#A26A5E] to-[#D54C2E] rounded-full flex items-center justify-center text-white font-bold">
                        {artist[0]}
                      </div>
                      <span>{artist}</span>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Demo Mode:</strong> Click any artist name above to
                  instantly access their dashboard. In production, this would be
                  replaced with proper authentication.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">📊 Track Your Income</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor sales, views, and earnings with real-time analytics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">🎨 Showcase Your Work</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload and manage your artwork portfolio with ease
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">🌍 Global Reach</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with collectors and fans worldwide
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
