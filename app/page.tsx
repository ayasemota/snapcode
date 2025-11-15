"use client";

import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Url from "./components/Url";
import Text from "./components/Text";
import Contact from "./components/Contact";
import Upload from "./components/Upload";
import Scan from "./components/Scan";
import QrDisplay from "./components/QrDisplay"; // ← now valid
import {
  QrCode,
  Link,
  MessageSquare,
  User,
  LucideIcon,
  Upload as UploadIcon,
  ScanLine,
} from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("url");
  const [qrData, setQrData] = useState<string>("");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Fix ESLint warning without changing behavior
    requestAnimationFrame(() => setIsPageLoaded(true));
  }, []);

  const handleTabChange = (tabId: string): void => {
    if (tabId === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setQrData("");
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const tabs: Tab[] = [
    { id: "url", label: "URL", icon: Link },
    { id: "text", label: "Text", icon: MessageSquare },
    { id: "contact", label: "Contact", icon: User },
    { id: "upload", label: "Upload", icon: UploadIcon },
    { id: "scan", label: "Scan", icon: ScanLine },
  ];

  return (
    <div
      className={`min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-100 flex flex-col transition-opacity duration-700 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <main className="flex-1 p-4 pt-12">
        <div className="max-w-4xl mx-auto">
          <div
            className={`text-center mb-8 transition-all duration-700 ${
              isPageLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-8"
            }`}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 hover:scale-105 transition-transform duration-300">
              SnapCode
            </h1>
            <p className="text-gray-600 text-lg px-7 animate-in fade-in duration-500 delay-200">
              Generate QR codes for URLs, text, and contact information
            </p>
          </div>

          <div
            className={`bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-700 ${
              isPageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto lg:overflow-hidden">
                {tabs.map((tab: Tab, index: number) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={(): void => handleTabChange(tab.id)}
                      className={`flex-1 flex items-center justify-center cursor-pointer gap-2 px-8 py-4 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        activeTab === tab.id
                          ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50 shadow-sm"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <IconComponent
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeTab === tab.id
                            ? "scale-110"
                            : "group-hover:scale-110"
                        }`}
                      />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-8">
              <div
                className={`grid ${
                  activeTab === "scan" ? "lg:grid-cols-1" : "lg:grid-cols-2"
                } gap-8 transition-all duration-300`}
              >
                <div
                  className={`space-y-6 transition-all duration-300 ${
                    isTransitioning
                      ? "opacity-0 -translate-x-5"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 hover:text-purple-600 transition-colors duration-300">
                    {activeTab === "url" && "Enter URL"}
                    {activeTab === "text" && "Enter Text"}
                    {activeTab === "contact" && "Contact Information"}
                    {activeTab === "upload" && "Upload QR Code"}
                    {activeTab === "scan" && "Scan QR Code"}
                  </h2>

                  {activeTab === "url" && <Url setQrData={setQrData} />}
                  {activeTab === "text" && <Text setQrData={setQrData} />}
                  {activeTab === "contact" && <Contact setQrData={setQrData} />}
                  {activeTab === "upload" && <Upload setQrData={setQrData} />}
                  {activeTab === "scan" && <Scan setQrData={setQrData} />}
                </div>

                <div
                  className={`transition-all duration-300 ${
                    isTransitioning
                      ? "opacity-0 translate-x-5"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  <QrDisplay qrData={qrData} activeTab={activeTab} />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`text-center mt-8 text-gray-500 text-sm transition-all duration-700 delay-500 ${
              isPageLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <p className="hover:text-gray-700 transition-colors duration-200">
              Generate QR codes instantly • No data stored • Free to use
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
