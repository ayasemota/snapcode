import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { Upload, Camera, X } from "lucide-react";
import jsQR from "jsqr";

interface ScanProps {
  setQrData: Dispatch<SetStateAction<string>>;
}

export default function Scan({ setQrData }: ScanProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [scannedResult, setScannedResult] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setError("");
    setScannedResult("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        startScanning();
      }
    } catch {
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setCameraActive(false);
  };

  const startScanning = () => {
    scanIntervalRef.current = window.setInterval(() => scanFromCamera(), 300);
  };

  const scanFromCamera = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = await detectQRCode(imageData);

    if (result) {
      setScannedResult(result);
      setQrData(result);
      stopCamera();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setError("");
    setScannedResult("");

    try {
      const imageUrl = URL.createObjectURL(file);
      const result = await scanQRCode(imageUrl);
      if (result) {
        setScannedResult(result);
        setQrData(result);
      } else {
        setError("No QR code found in the image");
        setQrData("");
      }
    } catch {
      setError("Failed to scan QR code. Please try another image.");
      setQrData("");
    } finally {
      setScanning(false);
    }
  };

  const scanQRCode = async (imageUrl: string) => {
    return new Promise<string | null>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        resolve(code ? code.data : null);
      };
      img.onerror = () => resolve(null);
      img.src = imageUrl;
    });
  };

  const detectQRCode = async (imageData: ImageData) => {
    if (window.BarcodeDetector) {
      try {
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        const barcodes = await detector.detect(imageData);
        if (barcodes.length > 0) return barcodes[0].rawValue;
      } catch {
        console.error("BarcodeDetector error");
      }
    }
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    return code ? code.data : null;
  };

  return (
    <div className="space-y-6">
      {!cameraActive ? (
        <>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors duration-200">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Scan QR Code
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Use your camera or upload an image to scan
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={startCamera}
                  className="inline-flex md:hidden items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                  Open Camera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={scanning}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  {scanning ? "Scanning..." : "Upload Image"}
                </button>
              </div>
            </div>
          </div>
          {scannedResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-800 font-medium mb-2">
                ✓ QR Code Scanned Successfully!
              </p>
              <p className="text-xs text-green-700 break-all">
                {scannedResult}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-auto max-h-[500px]"
              playsInline
              muted
              autoPlay
            />
            <canvas ref={canvasRef} className="hidden" />
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200 shadow-lg z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 border-white rounded-lg opacity-50 shadow-lg"></div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white text-sm bg-black bg-opacity-60 inline-block px-4 py-2 rounded-lg font-medium">
                Scanning for QR code...
              </p>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> For best results, ensure the QR code is clearly
          visible and well-lit.
        </p>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    BarcodeDetector: BarcodeDetectorConstructor;
  }
}

interface BarcodeDetectorConstructor {
  new (options: { formats: string[] }): BarcodeDetectorInstance;
}

interface BarcodeDetectorInstance {
  detect(image: ImageData): Promise<DetectedBarcode[]>;
}

interface DetectedBarcode {
  rawValue: string;
}
