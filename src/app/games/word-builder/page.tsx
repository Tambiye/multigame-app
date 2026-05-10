"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/word-builder.module.css";

// --- Base words ---
const BASE_WORDS = [
  "generation",
  "developer",
  "javascript",
  "component",
  "framework",
];

// --- Simple dictionary (expand later)
const DICTIONARY = [
  "get", "net", "tone", "rent", "ten", "one", "gene", "rat",
  "eat", "tea", "art", "toe", "note", "go", "ran", "tag",
];

// --- Utility: check if word can be formed ---
function canFormWord(base: string, word: string) {
  const baseArr = base.split("");

  for (let char of word) {
    const index = baseArr.indexOf(char);
    if (index === -1) return false;
    baseArr.splice(index, 1);
  }

  return true;
}

export default function WordBuilder() {
  const [baseWord, setBaseWord] = useState("");
  const [input, setInput] = useState("");
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  // --- Generate new base word ---
  const newWord = () => {
    const random =
      BASE_WORDS[Math.floor(Math.random() * BASE_WORDS.length)];
    setBaseWord(random);
    setFoundWords([]);
    setInput("");
    setMessage("");
  };

  useEffect(() => {
    newWord();
  }, []);

  // --- Submit ---
  const handleSubmit = () => {
    const word = input.toLowerCase();

    if (word.length < 3) {
      setMessage("Too short");
    } else if (!canFormWord(baseWord, word)) {
      setMessage("Invalid letters");
    } else if (!DICTIONARY.includes(word)) {
      setMessage("Not in dictionary");
    } else if (foundWords.includes(word)) {
      setMessage("Already used");
    } else {
      setFoundWords([...foundWords, word]);
      setMessage("✅ Good!");
    }

    setInput("");
  };

  // --- Rank system ---
  const getRank = () => {
    const count = foundWords.length;

    if (count >= 30) return "👑 Master";
    if (count >= 20) return "🧙 Word Wizard";
    if (count >= 15) return "🌟 Wonderful";
    if (count >= 10) return "✅ Great";

    return "";
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Word Builder</h1>

      <p className={styles.baseWord}>{baseWord}</p>

      <p className={styles.rank}>{getRank()}</p>

      <label htmlFor="word" className={styles.label}>
        Make a word
      </label>

      <input
        id="word"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={styles.input}
        placeholder="Enter word"
      />

      <button onClick={handleSubmit} className={styles.button}>
        Submit
      </button>

      <p className={styles.message}>{message}</p>

      <div className={styles.words}>
        {foundWords.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>

      {foundWords.length >= 10 && (
        <button onClick={newWord} className={styles.next}>
          Next Word 🔥
        </button>
      )}
    </div>
  );
}