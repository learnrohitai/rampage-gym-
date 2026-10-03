"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Camera, RotateCw, CheckCircle2, AlertCircle, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ScannerProps {
  regId: string;
  onVerified: (payload: { regId: string; paymentRef: string }) => void;
}

/** Pull a registrant ID out of whatever the QR happens to encode. */
function extractRegId(raw: string): string {
  const match = raw.match(/MI\d{2}-\d{3,6}/i);
  if (match) return match[0].toUpperCase();
  const inUrl = raw.match(/regid=([^&\s]+)/i);
  if (inUrl) return decodeURIComponent(inUrl[1]).toUpperCase();
  return raw.trim();
}

export function Scanner({ regId, onVerified }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string>("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [manualId, setManualId] = useState("");

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setLoading(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPermissionDenied(false);
      setLoading(true);
    } catch (err) {
      const name = (err as Error).name;
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setPermissionDenied(true);
      } else {
        setError("Could not access camera. Please check permissions.");
      }
      setLoading(false);
    }
  }, [deviceId, facingMode]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(setDevices).catch(() => {});
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  /** Decode one frame; returns true if a code was found. */
  const decodeFrame = useCallback((): boolean => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth || !video.videoHeight) return false;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return false;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const found = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "attemptBoth",
    });

    if (!found?.data) return false;

    const id = extractRegId(found.data);
    stopCamera();
    toast.success(`QR scanned — ${id}`);
    onVerified({ regId: id, paymentRef: "" });
    return true;
  }, [onVerified, stopCamera]);

  /** Continuous scan loop while the camera is live. */
  useEffect(() => {
    if (!loading) return;

    const tick = () => {
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        if (decodeFrame()) return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [loading, decodeFrame]);

  const submitManual = () => {
    const id = manualId.trim().toUpperCase();
    if (!id) {
      toast.error("Enter a registration number");
      return;
    }
    onVerified({ regId: id, paymentRef: "" });
    setManualId("");
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {permissionDenied && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
          <Camera className="size-10 text-amber-400" />
          <div>
            <p className="font-semibold text-foreground">Camera permission denied</p>
            <p className="text-xs text-muted-foreground">
              Allow camera access in your browser settings and try again.
            </p>
          </div>
          <Button variant="outline" onClick={startCamera}>
            <RotateCw className="size-4" /> Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-card p-6">
          <div className="relative w-full overflow-hidden rounded-2xl border-2 border-gold/50 bg-black">
            <video
              ref={videoRef}
              className="aspect-video w-full object-cover"
              muted
              playsInline
              style={{ transform: "scaleX(-1)" }}
            />
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-xl border-2 border-gold/70 shadow-[0_0_24px_rgba(245,185,66,0.35)]">
                <ScanLine className="size-8 text-gold/80" />
              </div>
            </div>
            <div className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-red-500/20">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Point the camera at the athlete&apos;s QR code — it scans automatically.
          </p>
          <Button variant="outline" onClick={stopCamera}>
            Stop Camera
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={startCamera}>
          <Camera className="size-4" /> Start Camera
        </Button>
      )}

      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-card px-4 py-3">
        <p className="flex-1 text-xs text-muted-foreground">
          No camera or QR unreadable? Type the ID instead.
        </p>
        <Input
          value={manualId}
          onChange={(e) => setManualId(e.target.value)}
          placeholder={regId || "e.g. MI26-1234"}
          className="h-9 w-40 font-mono text-sm"
          onKeyDown={(e) => e.key === "Enter" && submitManual()}
        />
        <Button size="sm" variant="outline" onClick={submitManual}>
          Use ID
        </Button>
      </div>

      {devices.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {devices
            .filter((d) => d.label)
            .map((dev) => (
              <Button
                key={dev.deviceId}
                size="sm"
                variant="outline"
                onClick={() => setDeviceId(dev.deviceId)}
              >
                {dev.label.replace(/back/gi, "Back").replace(/front/gi, "Front")}
              </Button>
            ))}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}