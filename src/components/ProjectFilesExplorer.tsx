import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileCode,
  Download,
  Copy,
  Check,
  FileText,
  Terminal,
  Shield,
} from 'lucide-react';
import { ProjectFile } from '../types';

interface ProjectFilesExplorerProps {
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
}

export const ProjectFilesExplorer: React.FC<ProjectFilesExplorerProps> = ({
  onDownloadZip,
  isDownloadingZip,
}) => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string>('string_analyzer.py');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedFile, setCopiedFile] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/project-files')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.files)) {
          setFiles(data.files);
        }
      })
      .catch((err) => console.error('Failed to load project files:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const selectedFile = files.find((f) => f.name === selectedFileName) || files[0];

  const handleCopyContent = () => {
    if (selectedFile?.content) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    }
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.py')) return <FileCode className="w-4 h-4 text-amber-500" />;
    if (name.endsWith('.html')) return <FileCode className="w-4 h-4 text-orange-500" />;
    if (name.endsWith('.css')) return <FileCode className="w-4 h-4 text-blue-500" />;
    if (name.endsWith('.js')) return <FileCode className="w-4 h-4 text-yellow-500" />;
    if (name.endsWith('.md')) return <FileText className="w-4 h-4 text-indigo-500" />;
    if (name.includes('.env')) return <Shield className="w-4 h-4 text-emerald-500" />;
    return <Terminal className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              VS Code Project Explorer
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Browse every file in the project. Fully organized and ready to open in Visual Studio Code.
            </p>
          </div>

          <button
            type="button"
            onClick={onDownloadZip}
            disabled={isDownloadingZip}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer disabled:opacity-60 shadow-sm shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            {isDownloadingZip ? 'Preparing ZIP Archive...' : 'Download Complete ZIP'}
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Loading project files...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: File Tree */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="flex items-center gap-1.5 px-2 py-1.5 mb-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Folder className="w-4 h-4 text-blue-600" />
                <span>python_assistant_project/</span>
              </div>

              <div className="space-y-1">
                {files.map((file) => {
                  const isSelected = file.name === selectedFileName;
                  return (
                    <button
                      key={file.name}
                      type="button"
                      onClick={() => setSelectedFileName(file.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white font-medium shadow-sm'
                          : 'hover:bg-slate-200/70 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {getFileIcon(file.name)}
                        <span className="font-mono truncate">{file.name}</span>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-semibold shrink-0 ${
                          isSelected ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {file.language}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Code Viewer */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
              <div className="bg-slate-800/80 px-4 py-2.5 flex items-center justify-between border-b border-slate-700/60">
                <div className="flex items-center gap-2 truncate">
                  {selectedFile && getFileIcon(selectedFile.name)}
                  <span className="text-xs font-mono font-bold text-slate-200 truncate">
                    {selectedFile?.name}
                  </span>
                  {selectedFile?.desc && (
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      · {selectedFile.desc}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCopyContent}
                  className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedFile ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Content
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto max-h-[500px]">
                <code>{selectedFile?.content}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
