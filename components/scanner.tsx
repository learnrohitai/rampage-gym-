"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, RotateCw, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ScannerProps {
  regId: string;
  onVerified: (payload: { regId: string; paymentRef: string }) => void;
}

export function Scanner({ regId, onVerified }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string>("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((d) => {
      setDevices(d.filter((dev) => dev.kind === "videoinput"));
      if (d.some((dev) => dev.label.includes("back")) && !d.some((dev) => dev.label.includes("front"))) {
        setDeviceId(d.find((dev) => dev.label.includes("back"))?.deviceId ?? "");
      }
    });
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode,
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPermissionDenied(false);
    } catch (err) {
      if ((err as Error).name === "NotAllowedError" || (err as Error).name === "PermissionDeniedError") {
        setPermissionDenied(true);
      } else {
        setError("Could not access camera. Please check permissions.");
      }
    } finally {
      setLoading(false);
    }
  }, [deviceId, facingMode]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !video.readyState) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let darkPixels = 0;
      const totalPixels = canvas.width * canvas.height;

      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (brightness < 128) darkPixels++;
      }

      const ratio = darkPixels / totalPixels;
      if (ratio > 0.25) {
        clearInterval(interval);
        setLoading(false);
        toast.info("Scan the QR code in the frame");
      }
    }, 800);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const capture = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    toast.info("QR captured — now submit for verification");
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="size-4" />
          {error}
        </div>
      )}

      {permissionDenied ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
          <Camera className="size-10 text-amber-400" />
          <div>
            <p className="font-semibold text-foreground">Camera permission denied</p>
            <p className="text-sm text-muted-foreground">
              Please allow camera access in your browser settings and try again.
            </p>
          </div>
          <Button variant="outline" onClick={startCamera}>
            <RotateCw className="size-4" /> Retry
          </Button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-card p-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl border border-gold/30">
              <video
                ref={videoRef}
                className="size-full object-cover"
                muted
                playsInline
                style={{ transform: "scaleX(-1)" }}
              />
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-gold/50"></div>
            <div className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-red-500/20">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div className="absolute bottom-3 left-3 grid size-8 place-items-center rounded-full bg-gold/20">
              <CheckCircle2 className="size-4 text-gold" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Point the camera at the QR code
          </p>
          <Button variant="outline" onClick={capture}>
            <Camera className="size-4" /> Capture
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={startCamera}>
          <Camera className="size-4" /> Start Camera
        </Button>
      )}

      {devices.length > 0 && (
        <div className="flex gap-2">
          {devices.map((dev) => (
            <Button
              key={dev.deviceId}
              size="sm"
              variant="outline"
              onClick={() => setDeviceId(dev.deviceId)}
            >
              {dev.label.replace("back", "Back").replace("front", "Front")}
            </Button>
          ))}
        </div>
      )}

      <div className="relative">
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
