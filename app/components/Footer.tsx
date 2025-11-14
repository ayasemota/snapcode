import { Github } from 'lucide-react';

export default function Footer() {
  const currentYear: number = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">© {currentYear} SnapCode. All rights reserved.</p>
          <a href="https://github.com/ayasemota" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-200">
            <Github className="w-5 h-5" />
            <span className="text-sm font-medium">ayasemota</span>
          </a>
        </div>
      </div>
    </footer>
  );
}