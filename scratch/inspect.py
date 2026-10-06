import json

with open('words.js', 'r', encoding='utf-8') as f:
    text = f.read().strip()

# Strip 'const wordList = ' and trailing semicolon if present
text = text.replace('const wordList = ', '')
if text.endswith(';'):
    text = text[:-1]

full_list = json.loads(text)
word_length = 5
filtered = [w for w in full_list if len(w) == word_length]
unique_set = set(filtered)

print("1. fullList.length =", len(full_list))
print("2. fullList.filter(w => w.length === WORD_LENGTH).length =", len(filtered))
print("3. WORD_LENGTH =", word_length)
print("4. activeList.length =", len(filtered))
print("5. Unique filtered 5-letter count =", len(unique_set))
print("6. Duplicate count =", len(filtered) - len(unique_set))
