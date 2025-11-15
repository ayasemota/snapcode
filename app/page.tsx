"use client";

import { useState, useEffect, useRef } from "react";
import Footer from "./components/Footer";
import Url from "./components/Url";
import Text from "./components/Text";
import Contact from "./components/Contact";
import Scan from "./components/Scan";
import {
  QrCode,
  Link,
  MessageSquare,
  User,
  Download,
  Copy,
  Check,
  LucideIcon,
  ScanLine,
} from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

declare global {
  interface Window {
    QRious: QRiousConstructor;
  }
}

interface QRiousConstructor {
  new (options: QRiousOptions): QRiousInstance;
}

interface QRiousOptions {
  element: HTMLCanvasElement;
  value: string;
  size: number;
  background: string;
  foreground: string;
  level: string;
}

interface QRiousInstance {
  canvas: HTMLCanvasElement;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("url");
  const [qrData, setQrData] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const generateQRCode = async (text: string): Promise<void> => {
    if (!text.trim()) {
      if (qrContainerRef.current) qrContainerRef.current.innerHTML = "";
      return;
    }
    try {
      if (!window.QRious) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js";
        script.onload = (): void => createQR(text);
        document.head.appendChild(script);
      } else {
        createQR(text);
      }
    } catch (error) {
      generateFallbackQR(text);
    }
  };

  const createQR = (text: string): void => {
    if (!qrContainerRef.current) return;
    try {
      qrContainerRef.current.innerHTML = "";
      const canvas = document.createElement("canvas");
      qrContainerRef.current.appendChild(canvas);
      const qr = new window.QRious({
        element: canvas,
        value: text,
        size: 300,
        background: "white",
        foreground: "black",
        level: "M",
      });
      canvas.className = "w-full h-auto bg-white rounded-xl";
      canvas.style.maxWidth = "300px";
      canvas.style.height = "auto";
    } catch (error) {
      generateFallbackQR(text);
    }
  };

  const generateFallbackQR = (text: string): void => {
    if (!qrContainerRef.current) return;
    qrContainerRef.current.innerHTML = "";
    const img = document.createElement("img");
    const encodedData = encodeURIComponent(text);
    img.src = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodedData}&choe=UTF-8`;
    img.alt = "Generated QR Code";
    img.className = "w-full h-auto bg-white rounded-xl p-4";
    img.style.maxWidth = "800px";
    img.style.height = "auto";
    img.onerror = (): void => {
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}&format=png&margin=10`;
    };
    qrContainerRef.current.appendChild(img);
  };

  useEffect(() => {
    generateQRCode(qrData);
  }, [qrData]);

  const downloadQRCode = (): void => {
    if (!qrData) return;
    const canvas = qrContainerRef.current?.querySelector("canvas");
    const img = qrContainerRef.current?.querySelector("img");
    if (canvas) {
      const link = document.createElement("a");
      link.download = `ayz-snapcode-${activeTab}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } else if (img) {
      const link = document.createElement("a");
      link.download = `ayz-snapcode-${activeTab}.png`;
      link.href = img.src;
      link.click();
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    if (qrData) {
      try {
        await navigator.clipboard.writeText(qrData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  const tabs: Tab[] = [
    { id: "url", label: "URL", icon: Link },
    { id: "text", label: "Text", icon: MessageSquare },
    { id: "contact", label: "Contact", icon: User },
    { id: "scan", label: "Scan", icon: ScanLine },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-100 flex flex-col">
      <main className="flex-1 p-4 pt-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              SnapCode
            </h1>
            <p className="text-gray-600 text-lg px-7">
              Generate QR codes for URLs, text, and contact information
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                {tabs.map((tab: Tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={(): void => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    {activeTab === "url" && "Enter URL"}
                    {activeTab === "text" && "Enter Text"}
                    {activeTab === "contact" && "Contact Information"}
                    {activeTab === "scan" && "Scan QR Code"}
                  </h2>

                  {activeTab === "url" && <Url setQrData={setQrData} />}
                  {activeTab === "text" && <Text setQrData={setQrData} />}
                  {activeTab === "contact" && <Contact setQrData={setQrData} />}
                  {activeTab === "scan" && <Scan setQrData={setQrData} />}
                </div>

                <div className="flex flex-col items-center space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Generated QR Code
                  </h2>
                  <div className="bg-gray-50 rounded-2xl p-8 w-full max-w-sm">
                    {qrData ? (
                      <div className="text-center">
                        <div
                          ref={qrContainerRef}
                          className="flex justify-center"
                        ></div>
                        <p className="text-sm text-gray-600 mt-4">
                          Scan this QR code with your device
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                          Fill in the form to generate your QR code
                        </p>
                      </div>
                    )}
                  </div>

                  {qrData && (
                    <>
                      <div className="max-w-[400px] grid grid-rows-2 w-full sm:flex flex-wrap gap-4">
                        <button
                          onClick={downloadQRCode}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={copyToClipboard}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                        >
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
                      <div className="w-full max-w-sm">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          QR Code Data:
                        </h3>
                        <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600 max-h-32 overflow-y-auto">
                          <pre className="whitespace-pre-wrap wrap-break-word">
                            {qrData}
                          </pre>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>Generate QR codes instantly • No data stored • Free to use</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
