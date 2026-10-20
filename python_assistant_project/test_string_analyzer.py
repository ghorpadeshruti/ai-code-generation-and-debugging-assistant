"""
Unit Test Suite for String Analyzer
AI Code Generation and Debugging Assistant Project

Demonstrates three automated test cases covering:
- Test Case 1: Standard sentence analysis
- Test Case 2: Multi-whitespace, tabs, and newlines (verifying split() behavior vs split(" "))
- Test Case 3: Punctuation, capitalization, and frequency normalization
"""

import unittest
from string_analyzer import count_words, count_chars_excluding_spaces, get_word_frequency, analyze_string


class TestStringAnalyzer(unittest.TestCase):

    def test_case_1_standard_sentence(self):
        """
        Test Case 1: Standard clean English sentence with regular spacing.
        Verifies correct word count, non-space character count, and word frequencies.
        """
        text = "The quick brown fox jumps over the lazy dog."
        
        # Word count check: exactly 9 words
        self.assertEqual(count_words(text), 9)
        
        # Non-space character count: "Thequickbrownfoxjumpsoverthelazydog." = 36 chars
        # Total length is 44, spaces are 8 -> 44 - 8 = 36
        self.assertEqual(count_chars_excluding_spaces(text), 36)
        
        # Word frequency check: "the" appears twice (case-insensitive), other words appear once
        freq = get_word_frequency(text)
        self.assertEqual(freq.get("the"), 2)
        self.assertEqual(freq.get("fox"), 1)
        self.assertEqual(freq.get("dog"), 1)
        self.assertEqual(len(freq), 8)  # 8 unique words ("the" counted once)

    def test_case_2_multiple_spaces_and_newlines(self):
        """
        Test Case 2: Consecutive spaces, tabs, and newlines.
        CRITICAL TEST CASE for Bug #9:
        Demonstrates why text.split() is mandatory instead of text.split(" ").
        - text.split(" ") would incorrectly produce empty string elements '' and report 9+ words.
        - text.split() correctly collapses consecutive spaces and counts exactly 4 words.
        """
        text = "   Python     is   \n\t  very    fast!   "
        
        # Words are: ["Python", "is", "very", "fast!"] -> exactly 4 words
        self.assertEqual(count_words(text), 4)
        
        # Non-space characters: "Pythonisveryfast!" -> 6 + 2 + 4 + 5 = 17 characters
        self.assertEqual(count_chars_excluding_spaces(text), 17)
        
        # Verify that word frequency has exactly 4 words without empty string keys
        freq = get_word_frequency(text)
        self.assertNotIn("", freq)  # Crucial: no empty string key from multiple spaces
        self.assertEqual(freq.get("python"), 1)
        self.assertEqual(freq.get("fast"), 1)

    def test_case_3_mixed_case_punctuation_and_repetitions(self):
        """
        Test Case 3: Mixed case, heavy punctuation, and word repetitions.
        Verifies that punctuation attached to words is stripped and casing is normalized.
        """
        text = "Code, code, CODE! Debug code often; debug early."
        
        # Total words: ["Code,", "code,", "CODE!", "Debug", "code", "often;", "debug", "early."] = 8 words
        self.assertEqual(count_words(text), 8)
        self.assertEqual(count_chars_excluding_spaces(text), 41)
        
        freq = get_word_frequency(text)
        # "code" appears 4 times (Code,, code,, CODE!, code)
        self.assertEqual(freq.get("code"), 4)
        # "debug" appears 2 times (Debug, debug)
        self.assertEqual(freq.get("debug"), 2)
        # "often" appears 1 time
        self.assertEqual(freq.get("often"), 1)
        # "early" appears 1 time
        self.assertEqual(freq.get("early"), 1)

    def test_edge_case_empty_string(self):
        """Bonus Edge Case: Empty or whitespace-only strings."""
        self.assertEqual(count_words(""), 0)
        self.assertEqual(count_words("   \n\t   "), 0)
        self.assertEqual(count_chars_excluding_spaces(""), 0)
        self.assertEqual(get_word_frequency(""), {})


if __name__ == "__main__":
    print("Running Test Suite for String Analyzer...")
    unittest.main(verbosity=2)
