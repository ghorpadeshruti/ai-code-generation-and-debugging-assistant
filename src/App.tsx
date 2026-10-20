import React, { useState } from 'react';
import { Header } from './components/Header';
import { AssistantWorkbench } from './components/AssistantWorkbench';
import { StringAnalysisLab } from './components/StringAnalysisLab';
import { SplitBugShowcase } from './components/SplitBugShowcase';
import { ProjectFilesExplorer } from './components/ProjectFilesExplorer';
import {
  Code2,
  FileText,
  AlertCircle,
  CheckCircle2,
  FolderTree,
  ShieldCheck,
  Download,
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('assistant');
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      const res = await fetch('/api/download-project-zip');
      if (!res.ok) throw new Error('Failed to generate ZIP');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AI_Code_Generation_and_Debugging_Assistant.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Bar adhering to the Top Bar Contract */}
      <Header
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onDownloadZip={handleDownloadZip}
        isDownloadingZip={isDownloadingZip}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Title & Context (Anti-Slop: clean typography, no generic badges or pulsing dots) */}
        <section className="text-center max-w-3xl mx-auto pt-2 pb-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
            AI Code Generation and Debugging Assistant
          </h1>
          <p className="text-base text-slate-600 mt-2.5 leading-relaxed text-balance">
            An educational workspace to explain Python code in simple language, debug subtle errors, generate code from problem descriptions, and explore string analysis algorithms.
          </p>

          {/* Quick Section Switcher Buttons */}
          <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveSection('assistant')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSection === 'assistant'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Code Studio
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('analyzer')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSection === 'analyzer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              String Analyzer (Req 7)
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('split-bug')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSection === 'split-bug'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Split Bug Demo (Req 9)
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('tests')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSection === 'tests'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Unit Tests (Req 8)
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('files')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSection === 'files'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              Project Files
            </button>
          </div>
        </section>

        {/* Section Rendering */}
        {activeSection === 'assistant' && <AssistantWorkbench />}

        {activeSection === 'analyzer' && <StringAnalysisLab />}

        {activeSection === 'split-bug' && <SplitBugShowcase />}

        {activeSection === 'tests' && <StringAnalysisLab />}

        {activeSection === 'files' && (
          <ProjectFilesExplorer
            onDownloadZip={handleDownloadZip}
            isDownloadingZip={isDownloadingZip}
          />
        )}

        {/* Educational Security & VS Code Setup Callout */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Project Architecture & Secure API Setup Guidelines
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600">
            <div>
              <h4 className="font-bold text-slate-900 mb-1.5">
                1. Visual Studio Code Ready
              </h4>
              <p className="leading-relaxed">
                Click <strong>"Download Project ZIP"</strong> in the top header. Extract the archive and open the <code>python_assistant_project</code> folder in VS Code. All files (HTML, CSS, JS, Python scripts, test suite, and README) are organized for immediate use.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1.5">
                2. Never Hardcode API Keys
              </h4>
              <p className="leading-relaxed">
                Real Generative AI credentials must remain strictly confidential. In this project, the API key is passed securely through <code>.env</code> and read via <code>os.getenv("GEMINI_API_KEY")</code> on the server side. The client code never exposes your key.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1.5">
                3. Running Locally
              </h4>
              <p className="leading-relaxed">
                From the workspace root, run <code>npm install</code> and then <code>npm run dev</code>. Open the local URL shown in the terminal. The assistant works without an API key; Gemini is optional. The separate Python web interface can be started from <code>python_assistant_project</code> with <code>python app.py</code>.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-700">
            AI Code Generation and Debugging Assistant · Academic Project
          </p>
          <p>
            Features String Analysis, Unit Tests, split() Bug Breakdown, and Complete Standalone Source Code.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
