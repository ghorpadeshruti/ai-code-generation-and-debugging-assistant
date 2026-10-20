# AI-Powered Code Generation and Debugging Assistant

## Problem Statement

Beginning programmers need a simple way to understand Python code, turn a written task into a code example, and find common mistakes. This project provides those assistant tools alongside a working Python string analyzer and a demonstration of a whitespace-related `split(" ")` bug.

The string analyzer reports the number of words, the number of non-whitespace characters, and a case-insensitive word-frequency dictionary. It uses `text.split()` so repeated spaces, tabs, and newlines do not create empty words.

## Project Layout

- `src/` and `server.ts`: React interface and local server for the code assistant.
- `python_assistant_project/`: Standalone Python analyzer, Flask interface, tests, and split bug demonstration.
- `python_assistant_project/string_analyzer.py`: Reusable string analysis functions and command-line example.
- `python_assistant_project/test_string_analyzer.py`: Automated Python tests.
- `python_assistant_project/demonstrate_split_bug.py`: Runnable bug and correction example.

## Run the Main Application

Prerequisites: Node.js, npm, and Python 3.

From the workspace root in the VS Code terminal:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:3000`). The assistant works in offline fallback mode without an API key. To enable Gemini responses, put `GEMINI_API_KEY=your_key` in a local `.env` file at the workspace root. The server reads the key; it is not sent to the browser. Never commit `.env` or paste a real key into source code.

## Run the Python Analyzer and Tests

From the workspace root:

```powershell
python python_assistant_project/string_analyzer.py
python -m unittest discover -s python_assistant_project -p "test_*.py" -v
python python_assistant_project/demonstrate_split_bug.py
```

The Python web interface is optional. To run it, install its dependencies and start it from its folder:

```powershell
cd python_assistant_project
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Then open `http://127.0.0.1:5000`. Without `GEMINI_API_KEY`, this interface uses its built-in offline assistant. If you configure Gemini, store the key in an environment variable or a local `.env` file; the existing `.env.example` is a template, not a place for a real key.

## AI Prompt

The application sends beginner-oriented instructions to the AI service when a key is configured. Example prompt for code generation:

> Write a beginner-friendly Python program that accepts a string and reports its word count, character count excluding whitespace, and case-insensitive word frequencies. Handle repeated spaces, tabs, and newlines correctly. Include comments and a short explanation.

The explain and debug actions use related prompts that ask for a plain-language walkthrough or concrete issues and corrected code. With no API key, local fallback logic keeps the main workflows usable.

## Testing Results

The Python unit test suite contains four tests: three required examples and an empty-input edge case. Expected values for the three examples are:

| Input | Words | Characters excluding whitespace | Frequency examples |
| --- | ---: | ---: | --- |
| `The quick brown fox jumps over the lazy dog.` | 9 | 36 | `the: 2`, `fox: 1` |
| `   Python     is   [tab/newline]  very    fast!   ` | 4 | 17 | `python: 1`, `fast: 1`; no empty-word key |
| `Code, code, CODE! Debug code often; debug early.` | 8 | 41 | `code: 4`, `debug: 2` |

Run the command above to execute the suite. The verified result is **4 tests passed**.

## Debugging Explanation: `split(" ")` vs `split()`

`text.split(" ")` splits only at each literal space. Repeated, leading, or trailing spaces can therefore create empty-string tokens; tabs and newlines are not treated as separators. For example, splitting `"   Hello    World   Python   "` this way produces 14 tokens, many of them empty.

Use `text.split()` instead. With no delimiter argument, Python groups consecutive whitespace and ignores whitespace at the edges, producing `['Hello', 'World', 'Python']` and the correct count of 3. The analyzer, demo script, and assistant's debugging feature demonstrate this fix.

## Conclusion

This project combines beginner-friendly code assistance with a testable Python string analyzer. Its unit tests verify normal text, mixed whitespace, punctuation, and empty input; its split demonstration makes a common tokenization bug visible and shows the reliable correction. The main application can be run locally without credentials, with Gemini available as an optional server-side integration.
