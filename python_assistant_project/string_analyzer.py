"""
String Analysis Program
AI Code Generation and Debugging Assistant Project

This module provides functions to analyze strings by computing:
1. Total word count (properly handling arbitrary whitespace)
2. Character count excluding all whitespace characters
3. Word frequency distribution (case-insensitive and punctuation-cleaned)
"""

import string
import re
from typing import Dict, Any


def count_words(text: str) -> int:
    """
    Counts the number of words in a string.
    
    IMPORTANT NOTE ON BUG PREVENTION:
    We use text.split() WITHOUT arguments.
    - text.split() treats consecutive whitespace (spaces, tabs, newlines) as a single delimiter
      and automatically discards leading/trailing whitespace.
    - text.split(" ") splits strictly on a single space character, creating empty string ''
      elements when consecutive spaces or tabs/newlines appear.
    """
    if not text or not text.strip():
        return 0
    words = text.split()
    return len(words)


def count_chars_excluding_spaces(text: str) -> int:
    """
    Counts total characters in the text excluding whitespace (spaces, tabs, newlines).
    """
    if not text:
        return 0
    # Filter out any character where c.isspace() is True
    return sum(1 for char in text if not char.isspace())


def get_word_frequency(text: str) -> Dict[str, int]:
    """
    Computes a case-insensitive frequency dictionary of words in the text.
    Punctuation marks attached to words are stripped so 'python,' and 'python'
    are counted as the same word.
    """
    if not text or not text.strip():
        return {}

    frequency: Dict[str, int] = {}
    # Use text.split() to safely separate words by whitespace
    raw_words = text.split()

    for word in raw_words:
        # Lowercase the word
        cleaned = word.lower()
        # Strip leading and trailing punctuation (e.g., 'hello!' -> 'hello')
        cleaned = cleaned.strip(string.punctuation)
        
        # Only count if non-empty after punctuation removal
        if cleaned:
            frequency[cleaned] = frequency.get(cleaned, 0) + 1

    return frequency


def analyze_string(text: str) -> Dict[str, Any]:
    """
    Comprehensive string analysis function returning:
    - total_words: number of words
    - chars_no_spaces: total characters excluding whitespace
    - total_chars: total length including whitespace
    - word_frequency: frequency mapping of each word
    - unique_words: count of unique words
    """
    words_count = count_words(text)
    chars_no_spaces = count_chars_excluding_spaces(text)
    freq = get_word_frequency(text)
    
    return {
        "text": text,
        "total_words": words_count,
        "chars_no_spaces": chars_no_spaces,
        "total_chars": len(text),
        "word_frequency": freq,
        "unique_words": len(freq)
    }


def main():
    """Interactive command-line runner for students."""
    print("=" * 60)
    print(" Python String Analysis Program")
    print(" AI Code Generation and Debugging Assistant")
    print("=" * 60)
    
    sample_text = (
        "Python is a versatile programming language. Python is clean, "
        "Python is readable, and Python is beginner-friendly!"
    )
    
    print("\nDefault Sample Text:")
    print(f'"{sample_text}"\n')
    
    results = analyze_string(sample_text)
    print(f"Total Words:                    {results['total_words']}")
    print(f"Characters (excluding spaces):  {results['chars_no_spaces']}")
    print(f"Total Characters (raw length):  {results['total_chars']}")
    print(f"Unique Words:                   {results['unique_words']}")
    print("\nWord Frequencies:")
    for word, count in sorted(results["word_frequency"].items(), key=lambda x: x[1], reverse=True):
        print(f"  - '{word}': {count}")
    
    print("\n" + "-" * 60)
    user_input = input("Enter your own sentence to analyze (or press Enter to exit): ")
    if user_input.strip():
        user_res = analyze_string(user_input)
        print(f"\nYour Text Results:")
        print(f"Total Words:                   {user_res['total_words']}")
        print(f"Characters (excluding spaces): {user_res['chars_no_spaces']}")
        print("Word Frequency:", user_res["word_frequency"])


if __name__ == "__main__":
    main()
