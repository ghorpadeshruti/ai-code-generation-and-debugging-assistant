import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Code2,
  Copy,
  Check,
} from 'lucide-react';

interface SplitBugShowcaseProps {
  onLoadBuggyToEditor?: (code: string) => void;
}

export const SplitBugShowcase: React.FC<SplitBugShowcaseProps> = () => {
  const [testString, setTestString] = useState<string>(
    '   Hello    World   Python   '
  );

  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  // Compute Buggy version: text.split(" ")
  // In JS, split(" ") mimics Python's split(" ") by splitting strictly on single space
  const buggyTokens = testString.split(' ');
  const buggyCount = buggyTokens.length;

  // Compute Correct version: text.split()
  // In JS, split(/\s+/) on trimmed string mimics Python's default split()
  const correctTokens = testString.trim() ? testString.trim().split(/\s+/) : [];
  const correctCount = correctTokens.length;

  const presets = [
    { label: 'Multi-Space & Edges', value: '   Hello    World   Python   ' },
    { label: 'Consecutive Spaces', value: 'one   two     three' },
    { label: 'Tabs & Newlines', value: 'Python\t\nis\t\nawesome' },
    { label: 'Leading & Trailing', value: '   just_one_word   ' },
  ];

  const pythonSnippet = `\"\"\"
Demonstration of Python Bug #9: split(" ") vs split()
\"\"\"

# ❌ BUGGY IMPLEMENTATION:
def count_words_buggy(text: str):
    words = text.split(" ")  # Splits on EVERY single space!
    return len(words), words

# ✅ CORRECT IMPLEMENTATION:
def count_words_correct(text: str):
    words = text.split()     # Collapses all contiguous whitespace & trims edges
    return len(words), words

sentence = "   Hello    World   Python   "

b_count, b_tokens = count_words_buggy(sentence)
print(f"Buggy Count: {b_count}")       # Falsely reports 14 words!
print(f"Buggy Tokens: {b_tokens}")

c_count, c_tokens = count_words_correct(sentence)
print(f"Correct Count: {c_count}")     # Correctly reports 3 words!
print(f"Correct Tokens: {c_tokens}")`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Bug Showcase: <code>split(" ")</code> vs <code>split()</code>
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Requirement 9
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              One of the most frequent logical bugs in beginner Python code: passing <code>" "</code> as an argument to <code>str.split()</code>.
            </p>
          </div>
        </div>

        {/* Conceptual Explainer */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-4 text-xs sm:text-sm text-slate-800 space-y-2 mb-6">
          <div className="flex items-center gap-2 text-amber-900 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Why This Subtle Bug Happens in Python:</span>
          </div>
          <p className="leading-relaxed">
            In Python, calling <code>text.split(" ")</code> with an explicit space argument commands Python to look for <em>single, isolated space characters</em>. If there are 3 consecutive spaces between words, Python splits between space #1 and space #2, and then between space #2 and space #3, manufacturing <strong>phantom empty string <code>""</code> elements</strong>! Furthermore, leading and trailing spaces become empty strings, and tabs (<code>\t</code>) and newlines (<code>\n</code>) are completely ignored.
          </p>
          <p className="leading-relaxed">
            In contrast, calling <code>text.split()</code> <em>without arguments</em> triggers Python's smart whitespace algorithm: it automatically treats <strong>any contiguous block of whitespace</strong> (spaces, tabs, newlines) as a single delimiter and automatically discards leading/trailing whitespace.
          </p>
        </div>

        {/* Interactive Comparison Sandbox */}
        <div className="space-y-3">
          <label
            htmlFor="splitTestInput"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wide"
          >
            Test String (Try entering extra spaces, tabs, or newlines)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="splitTestInput"
              type="text"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="flex-1 px-3.5 py-2 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
            <button
              type="button"
              onClick={() => setTestString('   Hello    World   Python   ')}
              className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Reset Input
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <span>Presets:</span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTestString(p.value)}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Left: The Buggy Implementation */}
          <div className="bg-red-50/40 border border-red-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-red-100 mb-3">
                <span className="text-xs font-bold text-red-800 flex items-center gap-1.5 uppercase tracking-wide">
                  ❌ Buggy: <code>text.split(" ")</code>
                </span>
                <span className="text-[11px] font-mono text-red-600">
                  Explicit Single Space
                </span>
              </div>

              <div className="mb-4">
                <span className="text-xs font-medium text-slate-500 block">
                  Reported Word Count:
                </span>
                <span className="text-3xl font-extrabold text-red-600 font-mono tabular-nums">
                  {buggyCount} words
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <span className="text-xs font-semibold text-slate-700 block">
                  Resulting Tokens Array ({buggyTokens.length} items):
                </span>
                <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-red-100 rounded-lg min-h-[90px] max-h-[160px] overflow-y-auto">
                  {buggyTokens.map((token, idx) => {
                    const isEmpty = token === '';
                    return (
                      <span
                        key={idx}
                        className={`text-xs font-mono px-2 py-0.5 rounded border ${
                          isEmpty
                            ? 'bg-red-100 border-red-300 text-red-700 font-bold'
                            : 'bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        {isEmpty ? '"" (empty)' : `"${token}"`}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="text-xs text-red-700 font-medium pt-3 border-t border-red-100">
              ⚠️ <strong>The Pitfall:</strong> Multiple spaces create phantom empty string tokens <code>""</code>, artificially inflating the word count!
            </p>
          </div>

          {/* Right: The Corrected Implementation */}
          <div className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-3">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wide">
                  ✅ Correct: <code>text.split()</code>
                </span>
                <span className="text-[11px] font-mono text-emerald-600">
                  Default Delimiter (None)
                </span>
              </div>

              <div className="mb-4">
                <span className="text-xs font-medium text-slate-500 block">
                  Reported Word Count:
                </span>
                <span className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
                  {correctCount} words
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <span className="text-xs font-semibold text-slate-700 block">
                  Resulting Tokens Array ({correctTokens.length} items):
                </span>
                <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-emerald-100 rounded-lg min-h-[90px] max-h-[160px] overflow-y-auto">
                  {correctTokens.map((token, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-2 py-0.5 rounded border bg-emerald-100 border-emerald-300 text-emerald-800 font-bold"
                    >
                      "{token}"
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-emerald-700 font-medium pt-3 border-t border-emerald-100">
              🎯 <strong>The Solution:</strong> <code>text.split()</code> groups any length of consecutive whitespace into a single delimiter and automatically strips edges.
            </p>
          </div>
        </div>
      </div>

      {/* Code Snippet Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-800/80 px-4 py-3 flex items-center justify-between border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono font-medium text-slate-300">
              demonstrate_split_bug.py
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopySnippet}
            className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            {copiedSnippet ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied Python Code!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Python Script
              </>
            )}
          </button>
        </div>

        <pre className="p-4 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
          <code>{pythonSnippet}</code>
        </pre>
      </div>
    </div>
  );
};
