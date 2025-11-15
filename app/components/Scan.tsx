import { Dispatch, SetStateAction } from "react";
import { Camera } from "lucide-react";

interface ScanProps {
  setQrData: Dispatch<SetStateAction<string>>;
}

export default function Scan({ setQrData }: ScanProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="relative border-2 border-gray-200 rounded-2xl py-16 text-center bg-white overflow-hidden group hover:border-purple-300 transition-all duration-300">
        <div className="absolute inset-0 bg-linear-to-br from-purple-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 px-4">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-purple-200 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <Camera className="w-24 h-24 text-purple-500 relative animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Camera Scanner
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Scan QR codes in real-time using your device camera
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 rounded-full">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Feature in Development
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
