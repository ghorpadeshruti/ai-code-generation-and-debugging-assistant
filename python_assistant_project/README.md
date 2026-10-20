# AI Code Generation and Debugging Assistant

A beginner-friendly educational Python project designed for students and educators. This project demonstrates how to build an interactive AI-assisted coding environment, master Python string manipulation, write automated unit tests, and understand subtle language pitfalls like Python's `split()` behavior.

---

## 📁 Project Structure

This project is organized cleanly and ready to open immediately in Visual Studio Code:

```
python_assistant_project/
├── index.html                  # Clean, responsive web interface
├── style.css                   # Modern student-project design & styling
├── script.js                   # Interactive client-side logic & API integration
├── string_analyzer.py          # Python program for string analysis (Req 7)
├── test_string_analyzer.py     # Automated unit test suite with 3+ test cases (Req 8)
├── demonstrate_split_bug.py    # Demonstration of the split(" ") bug & correction (Req 9)
├── app.py                      # Optional Python Flask backend with secure Gemini AI
├── requirements.txt            # Python dependencies (google-genai, flask, dotenv)
├── .env.example                # Example configuration for environment variables
└── README.md                   # Complete documentation and setup guide
```

---

## 🚀 Quick Start Guide: How to Open in Visual Studio Code

### Step 1: Open the Project in VS Code
1. Launch **Visual Studio Code**.
2. Click **File > Open Folder...** (or press `Ctrl+K Ctrl+O` on Windows/Linux, `Cmd+O` on macOS).
3. Select the `python_assistant_project` directory and click **Open**.

### Step 2: Option A – Run Frontend Directly (No Backend Required)
You can run the web interface right away without installing any Python dependencies:
1. Install the popular **Live Server** extension from the VS Code Extensions marketplace (`ritwickdey.LiveServer`).
2. Right-click `index.html` in the file explorer and select **"Open with Live Server"**.
3. Your browser will automatically open at `http://127.0.0.1:5500`.
4. All features (String Analyzer, Unit Tests runner, Split Bug sandbox, and rule-based AI explanation/debugging) work out of the box in standalone mode!

### Step 3: Option B – Run with Real Gemini AI via Python Backend
If you want to use the live Google Gemini API (`gemini-3.8-flash`):
1. Open the integrated terminal in VS Code (`Ctrl+\`` or `Terminal > New Terminal`).
2. Create and activate a virtual environment (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate       # On macOS/Linux
   venv\Scripts\activate          # On Windows
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your API key securely (see below).
5. Start the backend:
   ```bash
   python app.py
   ```
6. Open `http://localhost:5000` in your browser.

---

## 🔐 Secure API Key Configuration (Never Hardcode API Keys!)

When working with real Generative AI APIs (like Google Gemini), **security is paramount**. Never paste API keys directly into `index.html`, `script.js`, or push them to GitHub.

### Best Practice Setup:
1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```
2. **Edit `.env`:**
   Add your secret API key from [Google AI Studio](https://aistudio.google.com/):
   ```env
   GEMINI_API_KEY="AIzaSyYourSecretKeyHere"
   PORT=5000
   ```
3. **Verify `.gitignore`:**
   Ensure `.env` is listed in your `.gitignore` file so it is never committed to source control:
   ```
   .env
   __pycache__/
   venv/
   ```
4. **Server-Side Protection:**
   In `app.py`, the backend reads the key using `os.getenv("GEMINI_API_KEY")`. The client-side browser only communicates through proxy endpoints (`/api/ai/*`) without ever seeing or exposing your secret credentials.

---

## 🧵 Feature Breakdown

### 1. Interactive Web Interface (`index.html`, `style.css`, `script.js`)
- **Code Input Textarea:** Write or paste Python code with quick sample buttons (String Analyzer, Split Bug, Indentation Error, Palindrome).
- **Explain Code Button:** Breaks down Python code into plain English, highlighting functions, loops, and data structures.
- **Identify & Debug Errors Button:** Spots syntax errors, indentation issues, and logical traps (like `split(" ")`). Shows suggested corrections with a one-click "Load Fix into Editor" button.
- **Generate Python Code Button:** Takes a natural language problem prompt and generates beginner-friendly Python code with docstrings, comments, and complexity analysis.

### 2. String Analysis Program (`string_analyzer.py`)
Meets **Requirement 7**:
- `count_words(text)`: Accurately counts total words while handling multiple spaces, tabs, and newlines safely.
- `count_chars_excluding_spaces(text)`: Counts all characters while filtering out whitespace using `char.isspace()`.
- `get_word_frequency(text)`: Returns a case-insensitive dictionary mapping each unique word (with attached punctuation stripped) to its occurrence count.
- `analyze_string(text)`: Aggregates all metrics into a clean dictionary.

Run directly in the terminal:
```bash
python3 string_analyzer.py
```

### 3. Automated Unit Tests (`test_string_analyzer.py`)
Meets **Requirement 8** with 3 automated test cases:
- **Test Case 1 (Standard Sentence):** Verifies correct word counts, non-space character counts, and word frequencies on `"The quick brown fox jumps over the lazy dog."`.
- **Test Case 2 (Multi-Whitespace Edge Case):** Uses `"   Python     is   \n\t  very    fast!   "` to prove that contiguous spaces, tabs, and newlines do not inflate word counts.
- **Test Case 3 (Punctuation & Mixed Casing):** Tests `"Code, code, CODE! Debug code often; debug early."` to confirm that punctuation is stripped and casing is normalized.

Run the test suite:
```bash
python3 -m unittest test_string_analyzer.py
```

---

## 🐞 Deep Dive: The `split(" ")` vs `split()` Bug (Requirement 9)

A very common bug in beginner Python code is attempting to split a sentence into words using `text.split(" ")` with an explicit space string.

### Why `text.split(" ")` Fails (The Bug):
When an explicit delimiter string like `" "` is passed:
1. Python splits strictly on every individual ASCII space character.
2. If two or more spaces appear together (e.g., `"Python   is"`), Python splits between the first and second space, creating an **empty string `""`**!
3. Leading spaces produce an empty string at index 0.
4. Trailing spaces produce an empty string at the end of the list.
5. Tabs (`\t`) and newlines (`\n`) are completely ignored and remain glued to words.

### The Correction (`text.split()`):
When called **without arguments** (or with `None`):
1. Python treats any contiguous sequence of whitespace characters (spaces, tabs, newlines) as a single separator.
2. All leading and trailing whitespace is automatically trimmed.
3. No empty strings `""` are ever created in the output list.

### Comparison Example:
```python
text = "   Hello    World   Python   "

# ❌ BUGGY:
text.split(" ")
# Output: ['', '', '', 'Hello', '', '', '', 'World', '', '', 'Python', '', '', '']
# len() reports: 14 words! (Incorrect)

# ✅ CORRECTED:
text.split()
# Output: ['Hello', 'World', 'Python']
# len() reports: 3 words! (Accurate)
```

Run the standalone demonstration script:
```bash
python3 demonstrate_split_bug.py
```

---

## 🎓 Grading Rubric / Student Checklist

| Requirement | Implementation File | Status |
|:---|:---|:---:|
| 1. Clean HTML/CSS/JS interface | `index.html`, `style.css`, `script.js` | ✅ Complete |
| 2. Python code entry textarea | `index.html` (`#pythonCodeInput`) | ✅ Complete |
| 3. Explain code button | `script.js` (`handleExplainCode`) | ✅ Complete |
| 4. Identify & debug errors button | `script.js` (`handleDebugCode`) | ✅ Complete |
| 5. Generate code from description | `script.js` (`handleGenerateCode`) | ✅ Complete |
| 6. Clear display of outputs | `#outputContainer` (tabs & panels) | ✅ Complete |
| 7. String analysis program | `string_analyzer.py` | ✅ Complete |
| 8. At least 3 test cases | `test_string_analyzer.py` | ✅ Complete |
| 9. `split(" ")` bug & correction | `demonstrate_split_bug.py` | ✅ Complete |
| 10. Student-project design | `style.css` (clean 60-30-10 palette) | ✅ Complete |
| Secure API Key handling | `.env.example`, `app.py` | ✅ Complete |
