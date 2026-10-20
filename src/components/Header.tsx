import React from 'react';
import { Download } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  onDownloadZip,
  isDownloadingZip,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line, no decorative pills or subtitles) */}
        <button
          onClick={() => onNavigate('assistant')}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-blue-600 transition-colors text-left"
        >
          AI Code Assistant
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('assistant')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeSection === 'assistant'
                ? 'text-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Code Studio
          </button>
          <button
            onClick={() => onNavigate('analyzer')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeSection === 'analyzer'
                ? 'text-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            String Analyzer
          </button>
          <button
            onClick={() => onNavigate('split-bug')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeSection === 'split-bug'
                ? 'text-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Split Bug Demo
          </button>
          <button
            onClick={() => onNavigate('tests')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeSection === 'tests'
                ? 'text-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Unit Tests
          </button>
          <button
            onClick={() => onNavigate('files')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeSection === 'files'
                ? 'text-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Project Files
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onDownloadZip}
            disabled={isDownloadingZip}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 disabled:opacity-60 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            {isDownloadingZip ? 'Preparing ZIP...' : 'Download Project ZIP'}
          </button>
        </div>
      </div>
    </header>
  );
};
