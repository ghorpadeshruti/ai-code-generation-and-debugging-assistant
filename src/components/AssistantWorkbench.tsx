import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Bug,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  Code2,
  FileCheck2,
} from 'lucide-react';
import { ExplainResponse, DebugResponse, GenerateResponse } from '../types';
import { PYTHON_SAMPLES } from '../data/samples';

interface AssistantWorkbenchProps {
  onLoadCodeToSandbox?: (code: string) => void;
}

export const AssistantWorkbench: React.FC<AssistantWorkbenchProps> = () => {
  const [pythonCode, setPythonCode] = useState<string>(
    PYTHON_SAMPLES.string_analyzer.code
  );
  const [promptInput, setPromptInput] = useState<string>(
    'Write a Python program to analyze text: count words, non-space characters, and word frequency.'
  );

  const [activeOutputTab, setActiveOutputTab] = useState<
    'generated' | 'explanation' | 'debug'
  >('explanation');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<string>('');

  const [explainData, setExplainData] = useState<ExplainResponse | null>(null);
  const [debugData, setDebugData] = useState<DebugResponse | null>(null);
  const [generateData, setGenerateData] = useState<GenerateResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedGenCode, setCopiedGenCode] = useState<boolean>(false);
  const [appliedFix, setAppliedFix] = useState<boolean>(false);

  // 1. Explain Code Handler (Req 3)
  const handleExplain = async () => {
    if (!pythonCode.trim()) {
      setErrorMessage('Please enter or paste Python code into the editor first.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    setLoadingAction('Explaining code in plain English...');

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: pythonCode }),
      });
      if (!res.ok) throw new Error('Failed to explain code');
      const data: ExplainResponse = await res.json();
      setExplainData(data);
      setActiveOutputTab('explanation');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error communicating with assistant backend.');
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  };

  // 2. Identify & Debug Errors Handler (Req 4 & 9)
  const handleDebug = async () => {
    if (!pythonCode.trim()) {
      setErrorMessage('Please enter Python code to debug.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    setLoadingAction('Scanning for syntax errors, logical bugs, and pitfalls...');

    try {
      const res = await fetch('/api/ai/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: pythonCode }),
      });
      if (!res.ok) throw new Error('Failed to debug code');
      const data: DebugResponse = await res.json();
      setDebugData(data);
      setActiveOutputTab('debug');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error communicating with assistant backend.');
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  };

  // 3. Generate Python Code from Description Handler (Req 5)
  const handleGenerate = async () => {
    if (!promptInput.trim()) {
      setErrorMessage('Please enter a problem description first.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    setLoadingAction('Generating beginner-friendly Python solution...');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptInput }),
      });
      if (!res.ok) throw new Error('Failed to generate code');
      const data: GenerateResponse = await res.json();
      setGenerateData(data);
      setActiveOutputTab('generated');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error communicating with assistant backend.');
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  };

  const handleCopyInputCode = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyGeneratedCode = () => {
    if (generateData?.code) {
      navigator.clipboard.writeText(generateData.code);
      setCopiedGenCode(true);
      setTimeout(() => setCopiedGenCode(false), 2000);
    }
  };

  const handleApplyFix = () => {
    if (debugData?.correctedCode) {
      setPythonCode(debugData.correctedCode);
      setAppliedFix(true);
      setTimeout(() => setAppliedFix(false), 2000);
    }
  };

  const handleLoadSample = (sampleKey: keyof typeof PYTHON_SAMPLES) => {
    const s = PYTHON_SAMPLES[sampleKey];
    setPythonCode(s.code);
    setPromptInput(s.prompt);
    setErrorMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Top Card: Problem Description & Code Generation (Req 5) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Code Studio
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Generate Python code from natural language, explain logic in simple words, or debug errors.
            </p>
          </div>

          {/* Quick Samples selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Presets:
            </span>
            {Object.entries(PYTHON_SAMPLES).map(([key, s]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleLoadSample(key as any)}
                className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Description Input for Code Generation */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4">
          <label
            htmlFor="problemDescription"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5"
          >
            Describe a Problem or Program to Generate (Requirement 5)
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              id="problemDescription"
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="e.g. Write a function to count word frequencies and non-space characters..."
              className="flex-1 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer disabled:opacity-60 shrink-0 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Python Code
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Code Editor on Left, Actions & Outputs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Editor (Req 2) */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col flex-1">
            <div className="bg-slate-800/80 px-4 py-2.5 flex items-center justify-between border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-mono font-medium text-slate-300">
                  main.py
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  · Python 3
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPythonCode('')}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-0.5 rounded cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 inline mr-1" />
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleCopyInputCode}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-0.5 rounded cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3 h-3 inline text-emerald-400 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 inline mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-900 flex-1">
              <textarea
                value={pythonCode}
                onChange={(e) => setPythonCode(e.target.value)}
                spellCheck={false}
                rows={16}
                placeholder="# Enter or paste Python code here to explain or debug..."
                className="w-full h-full min-h-[380px] bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-relaxed p-2 focus:outline-none resize-y"
              />
            </div>
          </div>

          {/* Action Toolbar: Explain & Debug Buttons (Req 3 & 4) */}
          <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <button
              type="button"
              onClick={handleExplain}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer disabled:opacity-60 shadow-sm"
            >
              <HelpCircle className="w-4 h-4" />
              Explain Code in Simple Words
            </button>

            <button
              type="button"
              onClick={handleDebug}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-60 shadow-sm"
            >
              <Bug className="w-4 h-4 text-amber-400" />
              Identify & Debug Errors
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Right Column: Structured Output Display (Req 6) */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col flex-1">
            {/* Tab Navigation */}
            <div className="flex items-center bg-slate-50 border-b border-slate-200 px-3 pt-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveOutputTab('explanation')}
                className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
                  activeOutputTab === 'explanation'
                    ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Simple Explanation
              </button>

              <button
                type="button"
                onClick={() => setActiveOutputTab('debug')}
                className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
                  activeOutputTab === 'debug'
                    ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Debugging & Fixes
              </button>

              <button
                type="button"
                onClick={() => setActiveOutputTab('generated')}
                className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
                  activeOutputTab === 'generated'
                    ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Generated Code
              </button>
            </div>

            {/* Output Body */}
            <div className="p-5 flex-1 overflow-y-auto max-h-[580px]">
              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium text-slate-700">{loadingAction}</p>
                  <p className="text-xs text-slate-400">
                    Applying pedagogical analysis and best practices...
                  </p>
                </div>
              ) : activeOutputTab === 'explanation' ? (
                /* Tab 1: Plain English Explanation */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">
                      Plain English Code Explanation
                    </h3>
                    <span className="text-xs text-slate-400">
                      Beginner-friendly breakdown
                    </span>
                  </div>

                  {explainData ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3.5">
                        <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
                          Overview
                        </p>
                        <p className="text-sm text-slate-800 leading-relaxed">
                          {explainData.explanation}
                        </p>
                      </div>

                      {explainData.keyConcepts?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            Key Python Concepts
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {explainData.keyConcepts.map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                              >
                                <span className="text-xs font-bold text-slate-900 block mb-0.5">
                                  {item.concept}
                                </span>
                                <span className="text-xs text-slate-600 leading-normal block">
                                  {item.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {explainData.stepByStep?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            Step-by-Step Execution
                          </h4>
                          <ol className="space-y-2 text-xs sm:text-sm text-slate-700">
                            {explainData.stepByStep.map((step, idx) => (
                              <li
                                key={idx}
                                className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex items-start gap-2.5"
                              >
                                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 text-sm space-y-2">
                      <HelpCircle className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="font-medium text-slate-600">
                        No explanation generated yet
                      </p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Click the "Explain Code in Simple Words" button to get a clear, step-by-step tutorial on what your code does.
                      </p>
                    </div>
                  )}
                </div>
              ) : activeOutputTab === 'debug' ? (
                /* Tab 2: Debugging Suggestions & Fixes */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">
                      Error Identification & Debugging
                    </h3>
                    {debugData?.correctedCode && (
                      <button
                        type="button"
                        onClick={handleApplyFix}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        {appliedFix ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            Applied to Editor!
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-3.5 h-3.5" />
                            Load Fix into Editor
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {debugData ? (
                    <div className="space-y-4">
                      {/* Status Banner */}
                      <div
                        className={`p-3 rounded-lg border text-xs font-medium ${
                          debugData.hasErrors
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        }`}
                      >
                        {debugData.hasErrors ? (
                          <span>
                            ⚠️ <strong>Potential Issues Found:</strong> We detected{' '}
                            {debugData.issues.length} pitfall(s) or bug(s) in your Python code.
                          </span>
                        ) : (
                          <span>
                            ✅ <strong>Clean Code:</strong> No fatal syntax or common logical errors detected!
                          </span>
                        )}
                      </div>

                      {/* Issues List */}
                      {debugData.issues?.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Detailed Findings
                          </h4>
                          {debugData.issues.map((iss, idx) => (
                            <div
                              key={idx}
                              className="bg-red-50/60 border border-red-200 rounded-lg p-3 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-red-800">
                                  {iss.type} · Line {iss.line}
                                </span>
                              </div>
                              <p className="text-slate-800 leading-relaxed font-normal">
                                {iss.message}
                              </p>
                              {iss.suggestion && (
                                <p className="text-emerald-700 font-medium pt-1">
                                  💡 <strong>Fix:</strong> {iss.suggestion}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Corrected Code */}
                      {debugData.correctedCode && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Suggested Corrected Code
                            </h4>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Verified PEP 8
                            </span>
                          </div>
                          <pre className="p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-lg overflow-x-auto">
                            <code>{debugData.correctedCode}</code>
                          </pre>
                        </div>
                      )}

                      {debugData.pedagogicalTip && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
                          <strong>🎓 Student Takeaway:</strong>{' '}
                          {debugData.pedagogicalTip}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 text-sm space-y-2">
                      <Bug className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="font-medium text-slate-600">
                        No errors analyzed yet
                      </p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Click "Identify & Debug Errors" to test your code for syntax issues, indentation problems, and logical pitfalls like <code>split(" ")</code>.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Tab 3: Generated Code (Req 5 & 6) */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">
                      Generated Python Code
                    </h3>
                    {generateData && (
                      <button
                        type="button"
                        onClick={handleCopyGeneratedCode}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedGenCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Code
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {generateData ? (
                    <div className="space-y-3">
                      <pre className="p-3.5 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm rounded-lg overflow-x-auto leading-relaxed">
                        <code>{generateData.code}</code>
                      </pre>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-700 space-y-1.5">
                        <p>
                          <strong>Explanation:</strong> {generateData.explanation}
                        </p>
                        {generateData.complexity && (
                          <p className="text-slate-500 font-mono">
                            <strong>Complexity:</strong> {generateData.complexity}
                          </p>
                        )}
                      </div>

                      {generateData.exampleUsage && (
                        <div>
                          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                            Example Test Usage
                          </span>
                          <pre className="p-2.5 bg-slate-100 text-slate-800 font-mono text-xs rounded border border-slate-200">
                            <code>{generateData.exampleUsage}</code>
                          </pre>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setPythonCode(generateData.code);
                          setActiveOutputTab('explanation');
                        }}
                        className="w-full py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Load Generated Code into Editor to Run or Debug →
                      </button>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 text-sm space-y-2">
                      <Sparkles className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="font-medium text-slate-600">
                        No code generated yet
                      </p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Type a problem description above (e.g., "Analyze text to count words and frequencies") and click "Generate Python Code".
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
