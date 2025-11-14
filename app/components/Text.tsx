import { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface TextProps {
   setQrData: Dispatch<SetStateAction<string>>;
}

export default function Text({ setQrData }: TextProps) {
   const [textInput, setTextInput] = useState<string>('');

   useEffect(() => {
      setQrData(textInput);
   }, [textInput, setQrData]);

   return (
      <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
         <textarea value={textInput} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setTextInput(e.target.value)} placeholder="Enter any text to generate QR code..." rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none" />
      </div>
   );
}