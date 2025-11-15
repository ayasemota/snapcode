import { useState, useEffect, Dispatch, SetStateAction } from "react";

interface UrlProps {
  setQrData: Dispatch<SetStateAction<string>>;
}

export default function Url({ setQrData }: UrlProps) {
  const [urlInput, setUrlInput] = useState<string>("");

  const formatUrl = (url: string): string => {
    if (!url.trim()) return "";
    if (!url.startsWith("http://") && !url.startsWith("https://"))
      return "https://" + url;
    return url;
  };

  useEffect(() => {
    setQrData(formatUrl(urlInput));
  }, [urlInput, setQrData]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Website URL
      </label>
      <input
        type="url"
        value={urlInput}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setUrlInput(e.target.value)
        }
        placeholder="example.com or https://example.com"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
      />
      <p className="text-xs text-gray-500 mt-1">
        Enter a website URL. If you don&apos;t include http://, we&apos;ll add
        https:// automatically.
      </p>
    </div>
  );
}
