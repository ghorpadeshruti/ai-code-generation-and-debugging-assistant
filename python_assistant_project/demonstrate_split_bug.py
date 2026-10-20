"""
Demonstration of Python Bug: split(" ") vs split()
AI Code Generation and Debugging Assistant Project

Requirement 9:
"Include an example of a bug caused by using split(" ") instead of split(),
and demonstrate the correction."
"""

def buggy_word_counter(text: str):
    """
    BUGGY IMPLEMENTATION:
    Uses text.split(" ") with an explicit space argument.
    
    Why this causes a serious logical bug:
    When split(" ") is used, Python searches for single literal space characters ' '.
    If two spaces appear together, Python splits between space #1 and space #2,
    producing an empty string '' as a phantom word!
    Furthermore, leading spaces, trailing spaces, tabs (\\t), and newlines (\\n)
    are NOT stripped.
    """
    words = text.split(" ")
    return words, len(words)


def correct_word_counter(text: str):
    """
    CORRECT IMPLEMENTATION:
    Uses text.split() WITHOUT any arguments.
    
    Why this is correct:
    When no delimiter is passed (or delimiter is None), Python uses a special algorithm:
    1. Consecutive whitespace characters (spaces, tabs, newlines, carriage returns)
       are grouped and treated as a single separator.
    2. Any leading or trailing whitespace is automatically stripped.
    3. The resulting list contains only genuine, non-empty word tokens.
    """
    words = text.split()
    return words, len(words)


def main():
    print("=" * 72)
    print(" DEMONSTRATING PYTHON BUG: text.split(' ') vs text.split()")
    print("=" * 72)
    
    # Example input with multiple consecutive spaces, leading/trailing spaces, and a newline
    problematic_string = "   Hello    World  \n\t  Python  "
    
    print(f"\nTest Input String:")
    print(f"  Repr: {repr(problematic_string)}")
    print(f"  Human readable meaning: 3 words ('Hello', 'World', 'Python') with extra spaces/tabs/newlines\n")
    
    # 1. Run the Buggy Version
    buggy_tokens, buggy_count = buggy_word_counter(problematic_string)
    print("❌ BUGGY CODE: text.split(' ')")
    print(f"   Resulting list: {buggy_tokens}")
    print(f"   Reported Word Count: {buggy_count}")
    print("   ⚠️  PROBLEM: Notice all the empty strings '' and unstripped '\\n\\t'!")
    print(f"   The buggy code claims there are {buggy_count} words instead of 3!\n")
    
    # 2. Run the Correct Version
    correct_tokens, correct_count = correct_word_counter(problematic_string)
    print("✅ CORRECT CODE: text.split()")
    print(f"   Resulting list: {correct_tokens}")
    print(f"   Reported Word Count: {correct_count}")
    print("   🎯 SUCCESS: Extra spaces collapsed, whitespace stripped, perfectly counted 3 words!\n")
    
    print("=" * 72)
    print(" SUMMARY TABLE FOR STUDENTS:")
    print("=" * 72)
    col2_header = "text.split(' ')"
    print(f"{'Input':<25} | {col2_header:<25} | {'text.split()':<15}")
    print("-" * 72)
    
    test_cases = [
        "one two",
        "one  two",
        "  leading",
        "trailing  ",
        "line1\\nline2"
    ]
    
    for case in [
        ("one two", "one two"),
        ("one  two", "one  two"),
        ("  leading", "  leading"),
        ("trailing  ", "trailing  "),
        ("line1\nline2", "line1\\nline2")
    ]:
        raw_str = case[0]
        label = case[1]
        b_res = str(raw_str.split(" "))
        c_res = str(raw_str.split())
        print(f"{label:<25} | {b_res:<25} | {c_res:<15}")

    print("\nKey Takeaway for Python Beginners:")
    print("Always use .split() without arguments unless you are parsing a delimited file (like CSV with ',')!")


if __name__ == "__main__":
    main()
