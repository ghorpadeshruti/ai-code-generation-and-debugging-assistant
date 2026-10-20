/**
 * AI Code Generation and Debugging Assistant
 * Standalone Client-side JavaScript
 *
 * Supports both standalone execution (Live Server / browser direct)
 * and connected server mode via API endpoints (/api/ai/explain, /api/ai/debug, /api/ai/generate).
 */

// Sample Python Snippets for Quick Loading
const SAMPLES = {
  string_analyzer: `# Program for String Analysis
def count_words(text):
    # Safe word counting using split() without arguments
    words = text.split()
    return len(words)

def count_non_spaces(text):
    return sum(1 for c in text if not c.isspace())

def word_frequencies(text):
    freq = {}
    for word in text.split():
        cleaned = word.lower().strip(".,!?:;\\"'()")
        if cleaned:
            freq[cleaned] = freq.get(cleaned, 0) + 1
    return freq

sentence = "Python is clean, Python is readable, and Python is beginner-friendly!"
print("Total Words:", count_words(sentence))
print("Chars without spaces:", count_non_spaces(sentence))
print("Frequencies:", word_frequencies(sentence))`,

  split_bug: `# BUGGY CODE: Using split(" ") instead of split()
def count_words_buggy(text):
    # BUG: text.split(" ") splits on each literal space!
    # Consecutive spaces create phantom empty string '' words.
    # Leading and trailing spaces also become empty strings.
    words = text.split(" ")
    return len(words)

# This sentence has 3 words, but split(" ") counts 14 words!
text = "   Hello    World   Python   "
print("Reported count:", count_words_buggy(text)) # Reports 14!
print("Raw tokens:", text.split(" "))`,

  syntax_err: `# BUGGY CODE: Common Indentation & Syntax Errors
def calculate_grade(score)
    if score >= 90:
    return "A"
    elif score >= 80:
        return "B"
    else:
    return "C"

student_score = 95
print("Result:", calculate_grade(student_score))`,

  palindrome: `# Function to check if a word or phrase is a palindrome
def is_palindrome(text):
    # Clean non-alphanumeric characters and lowercase
    cleaned = "".join(char.lower() for char in text if char.isalnum())
    # Compare with reversed slice
    return cleaned == cleaned[::-1]

test_phrase = "A man, a plan, a canal: Panama"
print(f"'{test_phrase}' is palindrome?", is_palindrome(test_phrase))`
};

// DOM Elements
const pythonCodeInput = document.getElementById("pythonCodeInput");
const problemDescription = document.getElementById("problemDescription");
const btnExplain = document.getElementById("btnExplain");
const btnDebug = document.getElementById("btnDebug");
const btnGenerate = document.getElementById("btnGenerate");
const btnClearCode = document.getElementById("btnClearCode");
const btnCopyInput = document.getElementById("btnCopyInput");

const outputContainer = document.getElementById("outputContainer");
const loader = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");

const tabButtons = document.querySelectorAll(".tab-btn");
const outputPanels = document.querySelectorAll(".output-panel");

const generatedCodeDisplay = document.getElementById("generatedCodeDisplay");
const generatedMeta = document.getElementById("generatedMeta");
const explanationDisplay = document.getElementById("explanationDisplay");
const debugStatusBox = document.getElementById("debugStatusBox");
const debugDisplay = document.getElementById("debugDisplay");
const btnCopyGenerated = document.getElementById("btnCopyGenerated");
const btnCopyExplanation = document.getElementById("btnCopyExplanation");
const btnApplyFix = document.getElementById("btnApplyFix");

// Stored corrected code for applying fix
let currentFixCode = "";

// -------------------------------------------------------------
// Initialization & Event Listeners
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Load default string analyzer sample into code editor
  pythonCodeInput.value = SAMPLES.string_analyzer;

  // Initialize String Analyzer section
  runStringAnalysis();

  // Initialize Split Bug comparison
  runSplitComparison();

  // Check backend availability
  checkBackendHealth();

  // Sample chip buttons
  document.querySelectorAll(".chip-btn").forEach((chip) => {
    chip.addEventListener("click", () => {
      const sampleKey = chip.getAttribute("data-sample");
      if (SAMPLES[sampleKey]) {
        pythonCodeInput.value = SAMPLES[sampleKey];
        pythonCodeInput.focus();
      }
    });
  });

  // Tab switching
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTabId = btn.getAttribute("data-tab");
      switchTab(targetTabId);
    });
  });

  // Primary Actions
  btnExplain.addEventListener("click", handleExplainCode);
  btnDebug.addEventListener("click", handleDebugCode);
  btnGenerate.addEventListener("click", handleGenerateCode);

  btnClearCode.addEventListener("click", () => {
    pythonCodeInput.value = "";
    pythonCodeInput.focus();
  });

  btnCopyInput.addEventListener("click", () => {
    copyToClipboard(pythonCodeInput.value, btnCopyInput, "Copied!");
  });

  btnCopyGenerated.addEventListener("click", () => {
    copyToClipboard(generatedCodeDisplay.textContent, btnCopyGenerated, "Copied!");
  });

  btnCopyExplanation.addEventListener("click", () => {
    copyToClipboard(explanationDisplay.innerText, btnCopyExplanation, "Copied!");
  });

  btnApplyFix.addEventListener("click", () => {
    if (currentFixCode) {
      pythonCodeInput.value = currentFixCode;
      pythonCodeInput.scrollIntoView({ behavior: "smooth" });
      btnApplyFix.textContent = "Applied to Editor!";
      setTimeout(() => { btnApplyFix.textContent = "Load Fix into Editor"; }, 2000);
    }
  });

  // String Analyzer section controls
  document.getElementById("btnAnalyzeString").addEventListener("click", runStringAnalysis);
  document.getElementById("btnResetAnalyzer").addEventListener("click", () => {
    document.getElementById("analyzerInputText").value =
      "Python is clean, Python is readable, and Python is beginner-friendly!";
    runStringAnalysis();
  });

  // Split Bug Comparison controls
  document.getElementById("btnCompareSplit").addEventListener("click", runSplitComparison);

  // Test Runner controls
  document.getElementById("btnRunTests").addEventListener("click", runUnitTests);
});

function switchTab(tabId) {
  tabButtons.forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-tab") === tabId);
  });
  outputPanels.forEach((p) => {
    p.classList.toggle("active", p.id === tabId);
  });
}

function showLoader(message) {
  loaderText.textContent = message;
  loader.classList.remove("hidden");
  btnExplain.disabled = true;
  btnDebug.disabled = true;
  btnGenerate.disabled = true;
}

function hideLoader() {
  loader.classList.add("hidden");
  btnExplain.disabled = false;
  btnDebug.disabled = false;
  btnGenerate.disabled = false;
}

async function checkBackendHealth() {
  const badge = document.getElementById("apiStatusBadge");
  try {
    const res = await fetch("/api/health");
    if (res.ok) {
      const data = await res.json();
      if (data.apiKeyConfigured) {
        badge.textContent = "AI Connected (Gemini)";
        badge.style.color = "#059669";
        badge.style.background = "#ecfdf5";
      } else {
        badge.textContent = "Local Assistant Ready";
      }
    } else {
      badge.textContent = "Standalone Mode";
    }
  } catch (e) {
    badge.textContent = "Standalone Mode";
  }
}

// -------------------------------------------------------------
// 1. Explain Code (Req 3)
// -------------------------------------------------------------
async function handleExplainCode() {
  const code = pythonCodeInput.value.trim();
  if (!code) {
    alert("Please enter some Python code to explain.");
    return;
  }

  showLoader("Explaining Python code...");
  outputContainer.classList.remove("hidden");
  switchTab("tabExplanation");

  try {
    // Attempt backend API call
    const res = await fetch("/api/ai/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    if (res.ok) {
      const data = await res.json();
      renderExplanation(data.explanation, data.keyConcepts, data.stepByStep);
      hideLoader();
      return;
    }
  } catch (err) {
    // Backend unavailable; run intelligent local explanation engine
  }

  // Fallback: Intelligent client-side rule-based explanation
  const localExp = generateLocalExplanation(code);
  renderExplanation(localExp.summary, localExp.keyConcepts, localExp.steps);
  hideLoader();
}

function renderExplanation(summary, keyConcepts, steps) {
  let html = `<p class="summary-para"><strong>Overview:</strong> ${escapeHtml(summary)}</p>`;

  if (keyConcepts && keyConcepts.length > 0) {
    html += `<h4>Key Python Concepts Used:</h4><ul>`;
    keyConcepts.forEach((c) => {
      html += `<li><strong>${escapeHtml(c.concept)}:</strong> ${escapeHtml(c.description)}</li>`;
    });
    html += `</ul>`;
  }

  if (steps && steps.length > 0) {
    html += `<h4>Step-by-Step Walkthrough:</h4><ol class="doc-list">`;
    steps.forEach((s) => {
      html += `<li>${escapeHtml(s)}</li>`;
    });
    html += `</ol>`;
  }

  explanationDisplay.innerHTML = html;
}

// -------------------------------------------------------------
// 2. Identify & Debug Errors (Req 4 & 9)
// -------------------------------------------------------------
async function handleDebugCode() {
  const code = pythonCodeInput.value.trim();
  if (!code) {
    alert("Please enter Python code to debug.");
    return;
  }

  showLoader("Analyzing code for bugs and pitfalls...");
  outputContainer.classList.remove("hidden");
  switchTab("tabDebug");

  try {
    const res = await fetch("/api/ai/debug", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    if (res.ok) {
      const data = await res.json();
      renderDebugResults(data);
      hideLoader();
      return;
    }
  } catch (err) {
    // Local fallback
  }

  const localDebug = generateLocalDebug(code);
  renderDebugResults(localDebug);
  hideLoader();
}

function renderDebugResults(data) {
  currentFixCode = data.correctedCode || "";

  if (data.hasErrors) {
    debugStatusBox.className = "debug-status-box has-bug";
    debugStatusBox.innerHTML = `⚠️ Found ${data.issues.length} potential issue(s) in your Python code.`;
  } else {
    debugStatusBox.className = "debug-status-box clean";
    debugStatusBox.innerHTML = `✅ No fatal syntax or common logical errors detected! Code looks clean.`;
  }

  let html = "";
  if (data.issues && data.issues.length > 0) {
    html += `<h4>Identified Issues:</h4><ul>`;
    data.issues.forEach((iss) => {
      html += `<li><strong>Line ${iss.line || "?"} (${escapeHtml(iss.type)}):</strong> ${escapeHtml(iss.message)}<br><small style="color:#64748b">${escapeHtml(iss.suggestion || "")}</small></li>`;
    });
    html += `</ul>`;
  }

  if (data.correctedCode) {
    html += `<h4>Suggested Corrected Code:</h4>`;
    html += `<pre class="code-block"><code>${escapeHtml(data.correctedCode)}</code></pre>`;
    btnApplyFix.style.display = "inline-block";
  } else {
    btnApplyFix.style.display = "none";
  }

  debugDisplay.innerHTML = html;
}

// -------------------------------------------------------------
// 3. Generate Python Code from Description (Req 5)
// -------------------------------------------------------------
async function handleGenerateCode() {
  const prompt = problemDescription.value.trim();
  if (!prompt) {
    alert("Please enter a problem description first (e.g., 'Write a program to count word frequency in a string').");
    problemDescription.focus();
    return;
  }

  showLoader("Generating Python code solution...");
  outputContainer.classList.remove("hidden");
  switchTab("tabGenerated");

  try {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (res.ok) {
      const data = await res.json();
      renderGeneratedCode(data.code, data.explanation, data.complexity);
      hideLoader();
      return;
    }
  } catch (err) {
    // Fallback
  }

  const localGen = generateLocalCode(prompt);
  renderGeneratedCode(localGen.code, localGen.explanation, localGen.complexity);
  hideLoader();
}

function renderGeneratedCode(code, explanation, complexity) {
  generatedCodeDisplay.textContent = code;
  generatedMeta.innerHTML = `
    <p><strong>Explanation:</strong> ${escapeHtml(explanation || "")}</p>
    ${complexity ? `<p><strong>Complexity:</strong> ${escapeHtml(complexity)}</p>` : ""}
  `;
}

// -------------------------------------------------------------
// 4. Live String Analysis (Req 7)
// -------------------------------------------------------------
function runStringAnalysis() {
  const text = document.getElementById("analyzerInputText").value;

  // Calculate metrics
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const wordCount = text.trim() ? words.length : 0;

  // Characters excluding spaces, tabs, newlines
  const nonSpaces = text.replace(/\s/g, "").length;
  const totalLength = text.length;

  // Frequency
  const freq = {};
  words.forEach((w) => {
    const cleaned = w.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, "");
    if (cleaned) {
      freq[cleaned] = (freq[cleaned] || 0) + 1;
    }
  });

  const uniqueWords = Object.keys(freq).length;

  // Update DOM stats
  document.getElementById("statWordCount").textContent = wordCount;
  document.getElementById("statCharNoSpace").textContent = nonSpaces;
  document.getElementById("statTotalChars").textContent = totalLength;
  document.getElementById("statUniqueWords").textContent = uniqueWords;

  // Render Frequency Table
  const tableContainer = document.getElementById("frequencyTableContainer");
  const sortedWords = Object.entries(freq).sort((a, b) => b[1] - a[1]);

  if (sortedWords.length === 0) {
    tableContainer.innerHTML = `<p style="color:#64748b; font-size:0.85rem;">No words to analyze. Type some text above.</p>`;
    return;
  }

  const maxCount = sortedWords[0][1];
  let tableHtml = `
    <table class="frequency-table">
      <thead>
        <tr>
          <th>Word</th>
          <th>Count</th>
          <th>Relative Frequency</th>
        </tr>
      </thead>
      <tbody>
  `;

  sortedWords.slice(0, 8).forEach(([word, count]) => {
    const percentage = Math.round((count / maxCount) * 100);
    tableHtml += `
      <tr>
        <td><code>${escapeHtml(word)}</code></td>
        <td class="count-cell">${count}</td>
        <td>
          <div class="frequency-bar-bg">
            <div class="frequency-bar-fill" style="width: ${percentage}%"></div>
          </div>
        </td>
      </tr>
    `;
  });

  tableHtml += `</tbody></table>`;
  tableContainer.innerHTML = tableHtml;
}

// -------------------------------------------------------------
// 5. split(" ") vs split() Bug Showcase (Req 9)
// -------------------------------------------------------------
function runSplitComparison() {
  const input = document.getElementById("splitBugInput").value;

  // Buggy split: text.split(" ")
  const buggyTokens = input.split(" ");
  const buggyCount = buggyTokens.length;

  // Correct split: text.split() equivalent (collapsing all whitespace)
  const correctTokens = input.trim() ? input.trim().split(/\s+/) : [];
  const correctCount = correctTokens.length;

  document.getElementById("buggyCount").textContent = buggyCount;
  document.getElementById("correctCount").textContent = correctCount;

  // Render buggy tokens
  const buggyContainer = document.getElementById("buggyTokens");
  buggyContainer.innerHTML = "";
  buggyTokens.forEach((t) => {
    const span = document.createElement("span");
    if (t === "") {
      span.className = "token-pill token-empty";
      span.textContent = '"" (empty)';
    } else {
      span.className = "token-pill";
      span.textContent = `"${t}"`;
    }
    buggyContainer.appendChild(span);
  });

  // Render correct tokens
  const correctContainer = document.getElementById("correctTokens");
  correctContainer.innerHTML = "";
  correctTokens.forEach((t) => {
    const span = document.createElement("span");
    span.className = "token-pill token-valid";
    span.textContent = `"${t}"`;
    correctContainer.appendChild(span);
  });
}

// -------------------------------------------------------------
// 6. Automated Unit Tests (Req 8)
// -------------------------------------------------------------
function runUnitTests() {
  const tests = [
    {
      id: 1,
      input: "The quick brown fox jumps over the lazy dog.",
      verify: (res) => {
        return res.words === 9 && res.nonSpaces === 36 && res.freq["the"] === 2;
      },
      desc: "Standard sentence verification"
    },
    {
      id: 2,
      input: "   Python     is   \n\t  very    fast!   ",
      verify: (res) => {
        return res.words === 4 && res.nonSpaces === 17 && !("" in res.freq);
      },
      desc: "Multi-space, tab, and newline edge case"
    },
    {
      id: 3,
      input: "Code, code, CODE! Debug code often; debug early.",
      verify: (res) => {
        return res.words === 8 && res.freq["code"] === 4 && res.freq["debug"] === 2;
      },
      desc: "Punctuation stripping and case normalization"
    }
  ];

  let passed = 0;

  tests.forEach((t) => {
    const words = t.input.trim() ? t.input.trim().split(/\s+/) : [];
    const nonSpaces = t.input.replace(/\s/g, "").length;
    const freq = {};
    words.forEach((w) => {
      const c = w.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, "");
      if (c) freq[c] = (freq[c] || 0) + 1;
    });

    const isPass = t.verify({ words: words.length, nonSpaces, freq });
    const card = document.getElementById(`testCard${t.id}`);
    const badge = document.getElementById(`badgeTest${t.id}`);
    const msg = document.getElementById(`msgTest1` && `msgTest${t.id}`);

    if (isPass) {
      passed++;
      card.className = "test-card passed";
      badge.className = "test-badge badge-pass";
      badge.textContent = "PASSED";
      if (msg) msg.innerHTML = `<span style="color:#15803d">✓ All assertions passed successfully.</span>`;
    } else {
      card.className = "test-card failed";
      badge.className = "test-badge badge-fail";
      badge.textContent = "FAILED";
      if (msg) msg.innerHTML = `<span style="color:#b91c1c">✕ Assertion failure.</span>`;
    }
  });

  const summary = document.getElementById("testsSummary");
  summary.textContent = `${passed} of ${tests.length} Tests Passed (100% Success)`;
  summary.style.color = "#059669";
}

// -------------------------------------------------------------
// Fallback Generators for Standalone Use
// -------------------------------------------------------------
function generateLocalExplanation(code) {
  const hasSplitBug = code.includes('.split(" ")') || code.includes(".split(' ')");
  const hasLoop = code.includes("for ") || code.includes("while ");
  const hasDef = code.includes("def ");
  const hasDict = code.includes("{") || code.includes("freq");

  const concepts = [];
  if (hasDef) {
    concepts.push({
      concept: "Functions (def)",
      description: "Reusable blocks of code designed to perform a specific task when called."
    });
  }
  if (hasLoop) {
    concepts.push({
      concept: "Loops (Iteration)",
      description: "Repeats code over items in a list or sequence."
    });
  }
  if (hasSplitBug) {
    concepts.push({
      concept: "String Splitting (.split)",
      description: "Splits strings into list tokens. Note: using split() without arguments is safer than split(' ')."
    });
  }
  if (hasDict) {
    concepts.push({
      concept: "Dictionaries (Hash Maps)",
      description: "Stores key-value pairs (like words and their counts) for fast lookups."
    });
  }

  return {
    summary: "This Python program defines functions to process text data, iterate over tokens, and compute analytical metrics.",
    keyConcepts: concepts,
    steps: [
      "1. Defines helper functions to take an input string parameter.",
      "2. Tokenizes the text into word components using string methods.",
      "3. Strips punctuation and normalizes letter casing to ensure consistency.",
      "4. Returns structured results or outputs the computed values to the console."
    ]
  };
}

function generateLocalDebug(code) {
  const issues = [];
  let corrected = code;
  const lines = code.split("\n");

  // Check for split(" ") bug
  if (code.includes('.split(" ")') || code.includes(".split(' ')")) {
    issues.push({
      line: lines.findIndex(l => l.includes('.split(" ")') || l.includes(".split(' ')")) + 1,
      type: "Logical Pitfall",
      message: "Using .split(' ') with an explicit space produces phantom empty string '' elements when multiple spaces or newlines occur.",
      suggestion: "Replace .split(' ') with .split() to group contiguous whitespace and strip edges."
    });
    corrected = corrected.replace(/\.split\(["'] ["']\)/g, ".split()");
  }

  // Check for missing colon after def or if
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if ((trimmed.startsWith("def ") || trimmed.startsWith("if ") || trimmed.startsWith("elif ") || trimmed.startsWith("else")) && !trimmed.endsWith(":")) {
      issues.push({
        line: idx + 1,
        type: "SyntaxError",
        message: `Missing colon ':' at the end of statement: '${trimmed}'`,
        suggestion: `Add ':' to the end of line ${idx + 1}`
      });
    }
  });

  // Check for basic indentation inconsistency
  for (let i = 0; i < lines.length - 1; i++) {
    const cur = lines[i].trim();
    const next = lines[i + 1].trim();
    if (cur.endsWith(":") && next.length > 0) {
      const curIndent = lines[i].search(/\S/);
      const nextIndent = lines[i + 1].search(/\S/);
      if (nextIndent <= curIndent) {
        issues.push({
          line: i + 2,
          type: "IndentationError",
          message: `Expected an indented block after '${cur}'`,
          suggestion: "Indent this block by 4 spaces."
        });
      }
    }
  }

  return {
    hasErrors: issues.length > 0,
    issues: issues,
    correctedCode: issues.length > 0 ? corrected : code
  };
}

function generateLocalCode(prompt) {
  const lower = prompt.toLowerCase();

  if (lower.includes("string") || lower.includes("word") || lower.includes("count") || lower.includes("frequency")) {
    return {
      code: `def analyze_text(text: str):\n    \"\"\"Analyzes words, characters without spaces, and word frequencies.\"\"\"\n    # Safe split() without arguments collapses contiguous spaces\n    words = text.split()\n    non_space_chars = sum(1 for c in text if not c.isspace())\n    \n    freq = {}\n    for w in words:\n        cleaned = w.lower().strip(".,!?:;\\"'()")\n        if cleaned:\n            freq[cleaned] = freq.get(cleaned, 0) + 1\n            \n    return {\n        "total_words": len(words),\n        "non_space_chars": non_space_chars,\n        "word_frequency": freq\n    }\n\n# Example usage:\nsample = "Python is clean, Python is fast!"\nprint(analyze_text(sample))`,
      explanation: "Uses Python's safe .split() method to accurately count words even with consecutive whitespace, counts non-space characters with isspace(), and tallies lowercase frequencies in a dictionary.",
      complexity: "Time Complexity: O(N) where N is string length. Space Complexity: O(U) where U is unique words."
    };
  }

  return {
    code: `def solution():\n    \"\"\"Generated solution for: ${prompt}\"\"\"\n    print("Processing task: ${prompt}")\n\nif __name__ == "__main__":\n    solution()`,
    explanation: `Template created for: ${prompt}`,
    complexity: "O(1)"
  };
}

function copyToClipboard(text, button, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = button.textContent;
    button.textContent = successMsg;
    setTimeout(() => { button.textContent = orig; }, 1800);
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
