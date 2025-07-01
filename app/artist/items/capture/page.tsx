"use client"

import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

export default function CaptureImagePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const router = useRouter()

  useEffect(() => {
    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setStream(mediaStream)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }

  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL("image/png")
    localStorage.setItem("capturedImage", imageData)

    // Stop camera
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }

    router.push("/artist/items/add")
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
        <canvas ref={canvasRef} className="hidden" />

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={captureSnapshot}
            size="lg"
            className="rounded-full w-16 h-16 bg-white hover:bg-gray-100 text-black"
          >
            <Camera className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </div>
  )
}
