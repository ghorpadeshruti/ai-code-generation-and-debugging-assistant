import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BarChart3,
  FileText,
  Hash,
  Type as TypeIcon,
  HelpCircle,
} from 'lucide-react';

interface TestCaseResult {
  id: number;
  title: string;
  input: string;
  expectedWords: number;
  expectedCharsNoSpaces: number;
  expectedKeyFreq: string;
  actualWords: number;
  actualCharsNoSpaces: number;
  actualKeyFreq: string;
  passed: boolean;
  notes: string;
}

export const StringAnalysisLab: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    'Python is clean, Python is readable, and Python is beginner-friendly!'
  );

  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  // Live calculation of string analysis metrics
  const words = inputText.trim() ? inputText.trim().split(/\s+/) : [];
  const wordCount = inputText.trim() ? words.length : 0;
  const charsNoSpaces = inputText.replace(/\s/g, '').length;
  const totalChars = inputText.length;

  // Word frequency map
  const freqMap: Record<string, number> = {};
  words.forEach((w) => {
    const cleaned = w.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
    if (cleaned) {
      freqMap[cleaned] = (freqMap[cleaned] || 0) + 1;
    }
  });

  const sortedFreq = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);
  const uniqueWords = Object.keys(freqMap).length;
  const maxFreq = sortedFreq.length > 0 ? sortedFreq[0][1] : 1;

  // Run the 3 unit test cases (Req 8)
  const handleRunTests = () => {
    setIsRunningTests(true);

    const testDefinitions = [
      {
        id: 1,
        title: 'Test Case 1: Standard Sentence',
        input: 'The quick brown fox jumps over the lazy dog.',
        expectedWords: 9,
        expectedCharsNoSpaces: 36,
        expectedKey: 'the: 2, fox: 1',
        verifyKey: (f: Record<string, number>) => f['the'] === 2 && f['fox'] === 1,
        notes: 'Verifies accurate word counting and case-insensitive tally on clean prose.',
      },
      {
        id: 2,
        title: 'Test Case 2: Multi-Space, Tabs & Newlines',
        input: '   Python     is   \n\t  very    fast!   ',
        expectedWords: 4,
        expectedCharsNoSpaces: 17,
        expectedKey: 'python: 1, fast: 1 (no empty tokens)',
        verifyKey: (f: Record<string, number>) =>
          !('' in f) && f['python'] === 1 && f['fast'] === 1,
        notes: 'Guarantees that consecutive spaces and newlines do NOT generate empty string tokens (Requirement 9 defense).',
      },
      {
        id: 3,
        title: 'Test Case 3: Mixed Casing & Punctuation',
        input: 'Code, code, CODE! Debug code often; debug early.',
        expectedWords: 8,
        expectedCharsNoSpaces: 41,
        expectedKey: 'code: 4, debug: 2',
        verifyKey: (f: Record<string, number>) => f['code'] === 4 && f['debug'] === 2,
        notes: 'Verifies that trailing punctuation (commas, exclamation marks, semicolons) is stripped and casing normalized.',
      },
    ];

    setTimeout(() => {
      const results: TestCaseResult[] = testDefinitions.map((td) => {
        const rawWords = td.input.trim() ? td.input.trim().split(/\s+/) : [];
        const actualWords = td.input.trim() ? rawWords.length : 0;
        const actualCharsNoSpaces = td.input.replace(/\s/g, '').length;

        const fMap: Record<string, number> = {};
        rawWords.forEach((w) => {
          const c = w.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
          if (c) fMap[c] = (fMap[c] || 0) + 1;
        });

        const keyMatched = td.verifyKey(fMap);
        const passed =
          actualWords === td.expectedWords &&
          actualCharsNoSpaces === td.expectedCharsNoSpaces &&
          keyMatched;

        let actualKeyStr = '';
        if (td.id === 1) {
          actualKeyStr = `the: ${fMap['the'] || 0}, fox: ${fMap['fox'] || 0}`;
        } else if (td.id === 2) {
          actualKeyStr = `python: ${fMap['python'] || 0}, fast: ${fMap['fast'] || 0} (${'' in fMap ? 'Has empty token!' : 'no empty tokens'})`;
        } else {
          actualKeyStr = `code: ${fMap['code'] || 0}, debug: ${fMap['debug'] || 0}`;
        }

        return {
          id: td.id,
          title: td.title,
          input: td.input,
          expectedWords: td.expectedWords,
          expectedCharsNoSpaces: td.expectedCharsNoSpaces,
          expectedKeyFreq: td.expectedKey,
          actualWords,
          actualCharsNoSpaces,
          actualKeyFreq: actualKeyStr,
          passed,
          notes: td.notes,
        };
      });

      setTestResults(results);
      setIsRunningTests(false);
    }, 400);
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: Interactive String Analysis Program (Req 7) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Python String Analysis Program (Live Execution)
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Requirement 7
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Live interactive simulator of <code>string_analyzer.py</code>. Computes word count, character count excluding spaces, and word frequency distribution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setInputText(
                  'Python is clean, Python is readable, and Python is beginner-friendly!'
                )
              }
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 inline mr-1" />
              Reset Text
            </button>
          </div>
        </div>

        {/* Input & Metrics Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-6 flex flex-col space-y-2">
            <label
              htmlFor="stringAnalysisInput"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wide"
            >
              Enter Any Text to Analyze
            </label>
            <textarea
              id="stringAnalysisInput"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={5}
              placeholder="Type or paste any text, sentence, or multiline paragraph here..."
              className="w-full flex-1 p-3.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 resize-y leading-relaxed font-sans"
            />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Quick Presets:</span>
              <button
                type="button"
                onClick={() =>
                  setInputText('   Hello     World   \n\t  Python   ')
                }
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Multi-Space & Tabs
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() =>
                  setInputText(
                    'Code, code, CODE! Debug code often; debug early.'
                  )
                }
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Punctuation & Repeat
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() =>
                  setInputText('The quick brown fox jumps over the lazy dog.')
                }
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Standard Pangram
              </button>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Total Words</span>
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="my-1.5">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {wordCount}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Using safe <code>split()</code> delimiter
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Chars (Excl. Spaces)</span>
                <Hash className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="my-1.5">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {charsNoSpaces}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Filters spaces, tabs, and newlines
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Total Characters</span>
                <TypeIcon className="w-4 h-4 text-purple-600" />
              </div>
              <div className="my-1.5">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {totalChars}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Raw string length with whitespace
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Unique Words</span>
                <BarChart3 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="my-1.5">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {uniqueWords}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Distinct lowercase normalized words
              </span>
            </div>
          </div>
        </div>

        {/* Word Frequency Distribution */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span>Word Frequency Distribution</span>
            <span className="text-xs font-normal text-slate-500">
              Normalized lowercase without attached punctuation
            </span>
          </h3>

          {sortedFreq.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400 bg-slate-50 rounded-lg">
              Enter some text above to view word frequency.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Word</th>
                    <th className="py-2.5 px-3">Occurrences</th>
                    <th className="py-2.5 px-3 w-1/2">Relative Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {sortedFreq.slice(0, 10).map(([w, cnt]) => {
                    const percentage = Math.round((cnt / maxFreq) * 100);
                    return (
                      <tr key={w} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-3 font-mono font-medium text-slate-900">
                          "{w}"
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-700 tabular-nums">
                          {cnt}
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                              {percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Automated Unit Tests (Req 8) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Automated Unit Test Suite
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Requirement 8
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Three comprehensive test cases validating the string analyzer against standard text, whitespace edge cases, and punctuation.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunTests}
            disabled={isRunningTests}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer disabled:opacity-60 shadow-sm shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {isRunningTests ? 'Running Assertions...' : 'Run All Unit Tests'}
          </button>
        </div>

        {/* 3 Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 1,
              title: 'Test Case 1: Standard Sentence',
              desc: 'Clean sentence with regular single-space separators.',
              input: 'The quick brown fox jumps over the lazy dog.',
              expected: 'Words: 9 | Chars (no space): 36 | "the": 2',
            },
            {
              id: 2,
              title: 'Test Case 2: Multi-Space & Newlines',
              desc: 'Consecutive spaces, tabs, and newlines (Tests split() robustness).',
              input: '   Python     is   \\n\\t  very    fast!   ',
              expected: 'Words: 4 | Chars (no space): 17 | No empty string keys',
            },
            {
              id: 3,
              title: 'Test Case 3: Punctuation & Casing',
              desc: 'Mixed case and punctuation attached to repeated words.',
              input: 'Code, code, CODE! Debug code often; debug early.',
              expected: 'Words: 8 | "code": 4 | "debug": 2',
            },
          ].map((tc) => {
            const result = testResults?.find((r) => r.id === tc.id);
            const isPassed = result?.passed;

            return (
              <div
                key={tc.id}
                className={`border rounded-xl p-4 flex flex-col justify-between transition-all ${
                  result
                    ? isPassed
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : 'bg-red-50/40 border-red-300'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">
                      {tc.title}
                    </span>
                    {result ? (
                      isPassed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          PASSED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                          <XCircle className="w-3 h-3 text-red-600" />
                          FAILED
                        </span>
                      )
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        READY
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mb-2.5">{tc.desc}</p>

                  <div className="bg-white border border-slate-200 rounded p-2 text-xs font-mono text-slate-800 break-all mb-2.5">
                    "{tc.input}"
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1 mb-3">
                    <div>
                      <strong>Expected:</strong> {tc.expected}
                    </div>
                    {result && (
                      <div
                        className={
                          isPassed ? 'text-emerald-700' : 'text-red-700'
                        }
                      >
                        <strong>Actual:</strong> Words: {result.actualWords} |
                        Chars: {result.actualCharsNoSpaces} | {result.actualKeyFreq}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-400">
                  {result
                    ? result.notes
                    : 'Click "Run All Unit Tests" to evaluate assertions.'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
