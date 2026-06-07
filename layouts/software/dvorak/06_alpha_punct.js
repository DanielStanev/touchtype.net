/* Dvorak — Level 6: Alphabet + punctuation */
TTData.addLevel('dvorak', {
  id: 'alpha_punct',
  order: 6,
  label: 'Alphabet + punctuation',
  hint: 'Letters and common punctuation',
  rule: function (ch) { return /^[a-z]$/.test(ch) || ",.;'/-".indexOf(ch) !== -1; },
  wordBank: [
    'the', 'of', 'and', 'to', 'in', 'is', 'you', 'that', 'it', 'he',
    'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'at', 'be',
    'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not',
    'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there',
    'use', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will',
    'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 'some',
    'would', 'make', 'like', 'him', 'into', 'time', 'has', 'look', 'two',
    'more', 'write', 'go', 'see', 'way', 'could', 'people', 'than', 'first',
    'water', 'been', 'call', 'who', 'its', 'now', 'find', 'long', 'down',
    'day', 'did', 'get', 'come', 'made', 'may', 'part', 'over', 'new',
    'sound', 'take', 'only', 'little', 'work', 'know', 'place', 'year',
    'live', 'back', 'give', 'most', 'very', 'after', 'thing', 'our', 'just',
    'name', 'good', 'man', 'think', 'say', 'great', 'where', 'help',
    'through', 'much', 'before', 'line', 'right', 'too', 'mean', 'old',
    'any', 'same', 'tell', 'boy', 'follow', 'came', 'want', 'show', 'also',
    "don't", "can't", "won't", "it's", "that's", "what's", "i'm", "you're",
    "they're", "we're", "she's", "he's", "let's", "here's", "there's",
    "shouldn't", "wouldn't", "couldn't", "didn't", "wasn't", "isn't",
    'e.g.', 'self-made', 'well-known', 'up-to-date', 'so-called',
    'real-time', 'long-term', 'high-end', 'full-time', 'front-end',
    'yes,', 'no,', 'well,', 'now,', 'then,', 'here,', 'also,',
    'first,', 'second,', 'next,', 'last,', 'today,', 'again,',
    'however,', 'finally,', 'perhaps,', 'instead,', 'therefore,',
    'hello;', 'stop;', 'wait;', 'think;', 'read;'
  ]
});
