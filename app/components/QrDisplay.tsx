"use client";

import { useRef, useEffect, useState } from "react";
import { QrCode, Download, Copy, Check } from "lucide-react";
import QRCodeLib from "qrcode";

interface QrDisplayProps {
  qrData: string;
  activeTab: string;
}

export default function QrDisplay({ qrData, activeTab }: QrDisplayProps) {
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const generateQRCode = async (text: string): Promise<void> => {
    if (!text.trim()) {
      if (qrContainerRef.current) qrContainerRef.current.innerHTML = "";
      return;
    }

    try {
      if (!qrContainerRef.current) return;
      qrContainerRef.current.innerHTML = "";
      
      const canvas = document.createElement("canvas");
      qrContainerRef.current.appendChild(canvas);

      await QRCodeLib.toCanvas(canvas, text, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      canvas.className = "w-full h-auto bg-white rounded-xl";
      canvas.style.maxWidth = "300px";
      canvas.style.height = "auto";
    } catch (error) {
      console.error("QR Code generation error:", error);
    }
  };

  useEffect(() => {
    if (activeTab !== "scan") {
      generateQRCode(qrData);
    }
  }, [qrData, activeTab]);

  const downloadQRCode = (): void => {
    if (!qrData) return;
    const canvas = qrContainerRef.current?.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = `ayz-snapcode-${activeTab}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    if (!qrData) return;
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (activeTab === "scan") return null;

  return (
    <div className="flex flex-col items-center space-y-6 animate-in fade-in slide-in-from-right duration-300">
      <h2 className="text-2xl font-semibold text-gray-800 transition-all duration-300 hover:text-purple-600">
        {activeTab === "upload" ? "Decoded QR Code" : "Generated QR Code"}
      </h2>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 w-full max-w-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        {qrData ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div ref={qrContainerRef} className="flex justify-center"></div>
            <p className="text-sm text-gray-600 mt-4 animate-in fade-in duration-500 delay-150">
              {activeTab === "upload" ? "QR code decoded successfully" : "Scan this QR code with your device"}
            </p>
          </div>
        ) : (
          <div className="text-center py-16 animate-in fade-in duration-300">
            <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-500">
              {activeTab === "upload" ? "Upload an image to decode QR code" : "Fill in the form to generate your QR code"}
            </p>
          </div>
        )}
      </div>
      {qrData && (
        <>
          <div className="max-w-[400px] grid grid-rows-2 w-full sm:flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom duration-500">
            <button onClick={downloadQRCode} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium shadow-md">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button onClick={copyToClipboard} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 font-medium">
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Data
                </>
              )}
            </button>
          </div>
          <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom duration-500 delay-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2 hover:text-purple-600">QR Code Data:</h3>
            <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600 max-h-32 overflow-y-auto border border-transparent hover:border-purple-200 hover:bg-gray-200 transition-colors duration-200">
              <pre className="whitespace-pre-wrap wrap-break-word">{qrData}</pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}