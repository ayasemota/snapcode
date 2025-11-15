import { useState, Dispatch, SetStateAction } from "react";
import { Upload as UploadIcon, Image as ImageIcon } from "lucide-react";
import jsQR from "jsqr";

interface UploadProps {
  setQrData: Dispatch<SetStateAction<string>>;
}

export default function Upload({ setQrData }: UploadProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [decoding, setDecoding] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFile = async (file: File): Promise<void> => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setError("");
    setDecoding(true);
    setUploadedImage("");

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>): Promise<void> => {
      const imageUrl = e.target?.result as string;

      try {
        const img = new Image();
        img.src = imageUrl;

        img.onload = (): void => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            setError("Failed to process image");
            setDecoding(false);
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            setQrData(code.data);
            setUploadedImage(imageUrl);
            setError("");
          } else {
            setError("No QR code found in image");
            setQrData("");
            setUploadedImage(imageUrl);
          }
          setDecoding(false);
        };

        img.onerror = (): void => {
          setError("Failed to load image");
          setDecoding(false);
        };
      } catch {
        setError("Failed to decode QR code. Please try another image.");
        setQrData("");
        setUploadedImage(imageUrl);
        setDecoding(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left duration-300">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? "border-purple-500 bg-purple-50 scale-105 shadow-lg"
            : "border-gray-300 bg-gray-50 hover:border-purple-300 hover:bg-purple-25 hover:shadow-md"
        }`}
      >
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center group"
        >
          {uploadedImage ? (
            <ImageIcon className="w-16 h-16 text-purple-600 mb-4 animate-in zoom-in duration-300" />
          ) : (
            <UploadIcon className="w-16 h-16 text-gray-400 mb-4 group-hover:text-purple-500 group-hover:scale-110 transition-all duration-300" />
          )}
          <p className="text-gray-700 font-medium mb-2 group-hover:text-purple-600 transition-colors duration-200">
            {uploadedImage ? "Image Uploaded" : "Upload QR Code Image"}
          </p>
          <p className="hidden lg:flex text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
            Drag and drop or click to browse
          </p>
          <p className="text-xs text-gray-400 mt-2 animate-in fade-in duration-300 delay-100">
            Supports: PNG, JPG, JPEG, WebP
          </p>
        </label>
      </div>

      {decoding && (
        <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-purple-600"></div>
          <p className="text-sm text-gray-600 mt-2 animate-pulse">
            Decoding QR code...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in slide-in-from-top duration-300">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
