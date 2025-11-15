import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { Camera, CameraOff, Monitor } from "lucide-react";
import jsQR from "jsqr";

interface ScanProps {
  setQrData: Dispatch<SetStateAction<string>>;
}

export default function Scan({ setQrData }: ScanProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const checkDevice = (): void => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 1024;
      setIsMobile(isMobileDevice);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanning(true);
        setError("");

        videoRef.current.onloadedmetadata = (): void => {
          videoRef.current?.play();
          scanFrame();
        };
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions.");
      setScanning(false);
    }
  };

  const stopScanning = (): void => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const scanFrame = (): void => {
    if (!videoRef.current || !canvasRef.current || !scanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      setQrData(code.data);
      stopScanning();
      return;
    }

    animationRef.current = requestAnimationFrame(scanFrame);
  };

  if (!isMobile) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="relative border-2 border-gray-200 rounded-2xl py-16 text-center bg-white overflow-hidden">
          <div className="relative z-10 px-4">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-50"></div>
              <Monitor className="w-24 h-24 text-blue-500 relative" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Desktop Device Detected
            </h3>
            <p className="text-gray-600 mb-4 max-w-sm mx-auto">
              Camera scanning is only available on mobile devices and tablets
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-50 rounded-full">
              <span className="text-sm font-medium text-blue-700">
                Use a mobile device to scan QR codes
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {!scanning ? (
        <div className="relative border-2 border-gray-200 rounded-2xl py-16 text-center bg-white overflow-hidden group hover:border-purple-300 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 px-4">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-purple-200 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <Camera className="w-24 h-24 text-purple-500 relative" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Camera Scanner
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Scan QR codes in real-time using your device camera
            </p>
            <button
              onClick={startScanning}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium shadow-md"
            >
              <Camera className="w-5 h-5" />
              Start Scanning
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              className="w-full h-auto"
              style={{ maxHeight: "500px", objectFit: "cover" }}
              playsInline
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <div className="w-64 h-64 border-4 border-purple-500 rounded-2xl shadow-2xl animate-pulse"></div>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500 rounded-br-2xl"></div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-white text-center text-sm font-medium">
                Position QR code within the frame
              </p>
            </div>
          </div>

          <button
            onClick={stopScanning}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium shadow-md"
          >
            <CameraOff className="w-5 h-5" />
            Stop Scanning
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in slide-in-from-top duration-300">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
