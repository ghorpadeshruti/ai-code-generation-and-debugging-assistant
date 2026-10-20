export const PYTHON_SAMPLES: Record<string, { label: string; code: string; prompt: string }> = {
  string_analyzer: {
    label: 'String Analyzer',
    prompt: 'Write a Python function to count words, non-space characters, and word frequency.',
    code: `"""
Python String Analysis Program
Calculates word counts, non-space character counts, and word frequency safely.
"""

def count_words(text: str) -> int:
    # Safe splitting: split() without arguments handles contiguous spaces, tabs, and newlines
    if not text or not text.strip():
        return 0
    words = text.split()
    return len(words)

def count_chars_excluding_spaces(text: str) -> int:
    # Filter out all whitespace characters
    return sum(1 for c in text if not c.isspace())

def get_word_frequency(text: str) -> dict:
    if not text or not text.strip():
        return {}
    
    freq = {}
    for word in text.split():
        cleaned = word.lower().strip(".,!?:;\\"'()")
        if cleaned:
            freq[cleaned] = freq.get(cleaned, 0) + 1
    return freq

# Example execution:
sentence = "Python is clean, Python is readable, and Python is beginner-friendly!"
print("Total Words:", count_words(sentence))
print("Chars (excl. spaces):", count_chars_excluding_spaces(sentence))
print("Word Frequency:", get_word_frequency(sentence))`,
  },
  split_bug: {
    label: 'Split Bug (Demonstration)',
    prompt: 'Demonstrate why text.split(" ") causes bugs on strings with multiple spaces.',
    code: `# BUGGY CODE: Using split(" ") with an explicit space argument
def count_words_buggy(text: str):
    # BUG: When split(" ") is used, contiguous spaces produce empty strings ''
    # Leading and trailing spaces also become empty strings!
    words = text.split(" ")
    return len(words), words

problematic_text = "   Python     is   \\n\\t  fast!   "
count, tokens = count_words_buggy(problematic_text)

print("Reported Word Count:", count)
# Reports 15 words instead of 3 words!
print("Tokens produced:", tokens)
print("Notice all the empty strings '' counted as words!")`,
  },
  syntax_err: {
    label: 'Indentation & Missing Colons',
    prompt: 'Fix indentation errors and missing colons in Python code.',
    code: `# BUGGY CODE: Common syntax and indentation errors
def calculate_grade(score)
    if score >= 90:
    return "A"
    elif score >= 80:
        return "B"
    else:
    return "C"

student_score = 95
print("Grade result:", calculate_grade(student_score))`,
  },
  palindrome: {
    label: 'Palindrome Checker',
    prompt: 'Write a Python program to check whether a sentence is a palindrome.',
    code: `def is_palindrome(text: str) -> bool:
    """
    Checks if a string reads the same forwards and backwards,
    ignoring casing, whitespace, and punctuation.
    """
    cleaned = "".join(char.lower() for char in text if char.isalnum())
    return cleaned == cleaned[::-1]

test_phrases = [
    "A man, a plan, a canal: Panama",
    "Race a car",
    "Was it a car or a cat I saw?"
]

for phrase in test_phrases:
    result = is_palindrome(phrase)
    print(f"'{phrase}' -> {'Palindrome' if result else 'Not a palindrome'}")`,
  },
};
