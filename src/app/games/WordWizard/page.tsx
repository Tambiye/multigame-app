"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/WordWizard.module.css";
import englishWords from "an-array-of-english-words";

// ─── Dictionary ───────────────────────────────────────────────────────────────
const VALID_WORDS = new Set(
  englishWords
    .map((w) => w.toLowerCase())
    .filter(
      (w) =>
        /^[a-z]+$/.test(w) &&
        w.length >= 3 &&
        w.length <= 15
    )
);

// ─── Base words ───────────────────────────────────────────────────────────────
// ─── Random base words ───────────────────────────────────────────────────────
const BASE_WORDS = englishWords
  .map((w) => w.toLowerCase())
  .filter(
    (w) =>
      /^[a-z]+$/.test(w) &&
      w.length >= 7 &&
      w.length <= 12 &&
      new Set(w).size >= 5
  );
// ─── Rank tiers ───────────────────────────────────────────────────────────────
const RANK_TIERS = [
  { min: 0, label: "", color: "" },
  { min: 10, label: "Word Wizard", color: "#a78bfa" },
  { min: 20, label: "Lexicon Lord", color: "#f59e0b" },
  { min: 30, label: "Grand Grammarian", color: "#38bdf8" },
  { min: 40, label: "Linguistic Oracle", color: "#f472b6" },
  { min: 50, label: "Transcendent Sage", color: "#34d399" },
];




function getRank(count: number) {
  let rank = RANK_TIERS[0];

  for (const r of RANK_TIERS) {
    if (count >= r.min) rank = r;
  }

  return rank;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function getRandomBaseWord() {
  return BASE_WORDS[
    Math.floor(Math.random() * BASE_WORDS.length)
  ];
}
function canFormWord(base: string, word: string) {
  const letters = base.toLowerCase().split("");

  for (const ch of word.toLowerCase()) {
    const idx = letters.indexOf(ch);

    if (idx === -1) return false;

    letters.splice(idx, 1);
  }

  return true;
}

function isValidWord(base: string, word: string) {
  return (
    word.length >= 3 &&
    word !== base &&
    canFormWord(base, word) &&
    VALID_WORDS.has(word)
  );
}

export default function WordWizard() {
  const [wordIndex, setWordIndex] = useState(0);
const [baseWord, setBaseWord] = useState("");
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const [message, setMessage] = useState<{
    text: string;
    ok: boolean;
  } | null>(null);

  const [toast, setToast] = useState({
    text: "",
    visible: false,
  });

  const [shake, setShake] = useState(false);
  const [newChip, setNewChip] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
useEffect(() => {
  setBaseWord(getRandomBaseWord());
}, []);
  // ─── Stats ──────────────────────────────────────────────────────────────────
  const count = foundWords.length;

  const rank = getRank(count);

  const nextMilestone =
    Math.ceil((count + 1) / 10) * 10;

  const baseForBar =
    Math.floor(count / 10) * 10;

  const progressPct =
    count === 0
      ? 0
      : ((count - baseForBar) / 10) * 100;

  const unlocked = count >= 10;

  // ─── Load next word ─────────────────────────────────────────────────────────
 function loadWord() {
  let nextWord = getRandomBaseWord();

  while (nextWord === baseWord) {
    nextWord = getRandomBaseWord();
  }

  setBaseWord(nextWord);

  setFoundWords([]);
  setInput("");
  setMessage(null);
  setNewChip("");

  inputRef.current?.focus();
}

  // ─── UI helpers ─────────────────────────────────────────────────────────────
  function showMsg(text: string, ok: boolean) {
    setMessage({ text, ok });

    setTimeout(() => {
      setMessage(null);
    }, 2200);
  }

  function showToast(text: string) {
    setToast({
      text,
      visible: true,
    });

    setTimeout(() => {
      setToast((t) => ({
        ...t,
        visible: false,
      }));
    }, 3000);
  }

  function triggerShake() {
    setShake(true);

    setTimeout(() => {
      setShake(false);
    }, 420);
  }

  // ─── Submit word ────────────────────────────────────────────────────────────
  function handleSubmit() {
    const word = input.trim().toLowerCase();

    setInput("");

    if (!word) return;

    if (word.length < 3) {
      showMsg("Need at least 3 letters", false);
      triggerShake();
      return;
    }

    if (word === baseWord) {
      showMsg("That's the base word!", false);
      triggerShake();
      return;
    }

    if (!canFormWord(baseWord, word)) {
      showMsg(
        "Can't be made from these letters",
        false
      );

      triggerShake();
      return;
    }

    if (!isValidWord(baseWord, word)) {
      showMsg("Not in dictionary", false);
      triggerShake();
      return;
    }

    if (foundWords.includes(word)) {
      showMsg("Already found that one", false);
      triggerShake();
      return;
    }

    const next = [...foundWords, word];

    setFoundWords(next);
    setNewChip(word);

    showMsg(`Nice — "${word}"!`, true);

    const milestones: Record<number, string> = {
      10: "Word Wizard unlocked!",
      20: "Lexicon Lord rises!",
      30: "Grand Grammarian achieved!",
      40: "Linguistic Oracle awakened!",
      50: "Transcendent Sage reached!",
    };

    if (milestones[next.length]) {
      setTimeout(() => {
        showToast(milestones[next.length]);
      }, 200);
    }
  }

  // ─── Next word ──────────────────────────────────────────────────────────────
function handleNext() {
  loadWord();
}

  return (
    <>
      <div className={styles.root}>
        {/* <h1 className={styles.title}>
          Word Wizard
        </h1> */}

        <p className={styles.eyebrow}>
          Make words from the letters below
        </p>

        
        <div className={styles.card}>
          <span className={styles.counter}>
            {count} found
          </span>

          <div className={styles.tiles}>
           {baseWord &&
  baseWord.split("").map((l, i) => (
              <div
                key={i}
                className={styles.tile}
              >
                {l}
              </div>
            ))}
          </div>

          <div className={styles.rankRow}>
            {rank.label && (
              <span
                className={styles.rankBadge}
                style={{
                  color: rank.color,
                  borderColor:
                    rank.color + "55",
                  background:
                    rank.color + "18",
                }}
              >
                {rank.label}
              </span>
            )}
          </div>

          <div className={styles.progressMeta}>
            <span>
              {count < 10
                ? `${count} of 10 to unlock next word`
                : `${count} words`}
            </span>

            <span>
              next rank at {nextMilestone}
            </span>
          </div>

          <div className={styles.progressBg}>
            <div
              className={styles.progressFill}
              style={{
                width: `${progressPct}%`,
              }}
            />
          </div>

          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              className={`${styles.input}${
                shake ? ` ${styles.shake}` : ""
              }`}
              value={input}
              placeholder="Type a word…"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleSubmit()
              }
            />

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>

          <div
            className={`${styles.message}${
              message
                ? message.ok
                  ? ` ${styles.ok}`
                  : ` ${styles.err}`
                : ""
            }`}
          >
            {message?.text ?? ""}
          </div>

          <div className={styles.chips}>
            {foundWords.map((w, i) => (
              <span
                key={w}
                className={`${styles.chip}${
                  w === newChip &&
                  i === foundWords.length - 1
                    ? ` ${styles.newChip}`
                    : ""
                }`}
              >
                {w}
              </span>
            ))}
          </div>

          {unlocked && (
            <>
              <div className={styles.divider} />

              <button
                className={styles.nextBtn}
                onClick={handleNext}
              >
                <span>Next word</span>

                <span className={styles.nextArrow}>
                  →
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className={`${styles.toast}${
          toast.visible
            ? ` ${styles.toastVisible}`
            : ""
        }`}
      >
        {toast.text}
      </div>
    </>
  );
}