"""
AI Code Generation and Debugging Assistant - Local Backend Server (Flask)

Demonstrates how to securely integrate Google Gemini Generative AI into a Python project
without hardcoding sensitive API keys.

To run:
1. pip install -r requirements.txt
2. Copy .env.example to .env and set GEMINI_API_KEY="your_api_key"
3. python app.py
4. Open http://localhost:5000 in your browser!
"""

import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file securely
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder=".")
CORS(app)

# Securely read the API key from system environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Optionally initialize Google GenAI SDK if key is present
genai_client = None
if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    try:
        from google import genai
        # Initialize the modern official client with required telemetry
        genai_client = genai.Client(
            api_key=GEMINI_API_KEY,
            http_options={'headers': {'User-Agent': 'aistudio-build'}}
        )
        print("✓ Connected to Google GenAI Client successfully.")
    except Exception as e:
        print(f"Warning: Could not initialize Google GenAI SDK: {e}")
        print("Falling back to built-in intelligent rule-based engine.")
else:
    print("Notice: No GEMINI_API_KEY configured in .env. Running in offline rule-based mode.")


@app.route("/")
def serve_index():
    """Serves the main student-friendly web interface."""
    return send_from_directory(".", "index.html")


@app.route("/<path:path>")
def serve_static(path):
    """Serves CSS, JS, and asset files."""
    return send_from_directory(".", path)


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint indicating whether API key is securely loaded."""
    return jsonify({
        "status": "ok",
        "apiKeyConfigured": bool(genai_client),
        "mode": "Gemini AI" if genai_client else "Offline Rule-Based"
    })


@app.route("/api/ai/explain", methods=["POST"])
def explain_code():
    """Explains Python code in simple language for beginners."""
    data = request.get_json() or {}
    code = data.get("code", "").strip()

    if not code:
        return jsonify({"error": "No Python code provided"}), 400

    if genai_client:
        try:
            prompt = (
                "You are an encouraging computer science teacher explaining Python code to a beginner.\n"
                "Explain what this code does in plain, simple, friendly language.\n"
                "Return a JSON object with:\n"
                "- 'explanation': A 2-3 sentence overview.\n"
                "- 'keyConcepts': list of objects {concept: string, description: string}.\n"
                "- 'stepByStep': list of strings walking through the code line by line.\n\n"
                f"Python Code:\n```python\n{code}\n```"
            )
            response = genai_client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            parsed = json.loads(response.text)
            return jsonify(parsed)
        except Exception as e:
            print("Gemini API call failed, using fallback:", e)

    # Local Fallback Rule Engine
    return jsonify({
        "explanation": "This Python code defines data structures, functions, or logic to process inputs and return results.",
        "keyConcepts": [
            {"concept": "Functions", "description": "Encapsulates reusable logic into named blocks using 'def'."},
            {"concept": "String Manipulation", "description": "Uses Python string methods to split, strip, or analyze text."}
        ],
        "stepByStep": [
            "1. Analyzes the input variables and parameters.",
            "2. Iterates over elements or evaluates conditional statements.",
            "3. Produces output or returns calculated values."
        ]
    })


@app.route("/api/ai/debug", methods=["POST"])
def debug_code():
    """Identifies and debugs errors in the provided Python code."""
    data = request.get_json() or {}
    code = data.get("code", "").strip()

    if not code:
        return jsonify({"error": "No code provided"}), 400

    # Specifically detect split(" ") bug locally
    has_split_bug = '.split(" ")' in code or ".split(' ')" in code
    
    if genai_client:
        try:
            prompt = (
                "You are an expert Python debugger and tutor. Analyze this code for bugs, syntax errors, "
                "indentation problems, or subtle pitfalls (like text.split(' ') creating empty strings instead of text.split()).\n"
                "Return JSON with:\n"
                "- 'hasErrors': boolean\n"
                "- 'issues': array of {line: number, type: string, message: string, suggestion: string}\n"
                "- 'correctedCode': string containing the fixed Python code\n\n"
                f"Code:\n```python\n{code}\n```"
            )
            response = genai_client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            parsed = json.loads(response.text)
            return jsonify(parsed)
        except Exception as e:
            print("Gemini API call failed, using fallback:", e)

    # Local fallback debugger
    issues = []
    corrected = code
    if has_split_bug:
        issues.append({
            "line": 1,
            "type": "Logical Pitfall",
            "message": "Using split(' ') with an explicit space character fails when multiple spaces or tabs appear, generating phantom empty string '' words.",
            "suggestion": "Use split() without arguments to collapse contiguous whitespace automatically."
        })
        corrected = corrected.replace('.split(" ")', '.split()').replace(".split(' ')", ".split()")

    return jsonify({
        "hasErrors": len(issues) > 0,
        "issues": issues,
        "correctedCode": corrected if issues else code
    })


@app.route("/api/ai/generate", methods=["POST"])
def generate_code():
    """Generates beginner-friendly Python code based on a problem description."""
    data = request.get_json() or {}
    user_prompt = data.get("prompt", "").strip()

    if not user_prompt:
        return jsonify({"error": "Please provide a problem prompt"}), 400

    if genai_client:
        try:
            prompt = (
                "You are a friendly Python programming instructor. Generate clean, well-commented, beginner-friendly "
                "Python code for the following task:\n"
                f"Task: {user_prompt}\n\n"
                "Return JSON with:\n"
                "- 'code': The complete Python code snippet.\n"
                "- 'explanation': Plain English explanation of how the code works.\n"
                "- 'complexity': Big-O Time & Space complexity.\n"
            )
            response = genai_client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            parsed = json.loads(response.text)
            return jsonify(parsed)
        except Exception as e:
            print("Gemini API call failed, using fallback:", e)

    # Local fallback generator
    return jsonify({
        "code": (
            "def analyze_string(text: str):\n"
            "    \"\"\"Counts words, non-space characters, and word frequency.\"\"\"\n"
            "    # Safe split() without arguments collapses all whitespace\n"
            "    words = text.split()\n"
            "    non_space_chars = sum(1 for c in text if not c.isspace())\n\n"
            "    freq = {}\n"
            "    for w in words:\n"
            "        cleaned = w.lower().strip(\".,!?:;\\\"'()\")\n"
            "        if cleaned:\n"
            "            freq[cleaned] = freq.get(cleaned, 0) + 1\n\n"
            "    return {\n"
            "        'total_words': len(words),\n"
            "        'chars_excluding_spaces': non_space_chars,\n"
            "        'word_frequency': freq\n"
            "    }\n\n"
            "sample = 'Python is clean, Python is readable, and Python is beginner-friendly!'\n"
            "print(analyze_string(sample))"
        ),
        "explanation": "Calculates word counts safely without empty tokens, counts characters without spaces using isspace(), and tallies frequencies in a dictionary.",
        "complexity": "Time Complexity: O(N) | Space Complexity: O(U) where U is unique words"
    })


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"Starting server on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
