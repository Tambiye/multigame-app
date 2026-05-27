"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/WordWizard.module.css";
import englishWords from "an-array-of-english-words";

import {
  WandSparkles,
  ScrollText,
  Crown,
  Sparkles,
  Flame,
  Scroll,
  Feather,
  Brain,
  Gem,
  Share2
} from "lucide-react";

import { BookOpenCheck } from "lucide-react";

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
  { min: 0, label: "", className: "" },

  {
    min: 10,
    label: "Word Wizard",
    className: "wizard",
    icon: <WandSparkles size={16} />
  },

  {
    min: 30,
    label: "Lexicon Lord",
    className: "lord",
    icon: <ScrollText size={16} />
  },

  {
    min: 60,
    label: "Grand Grammarian",
    className: "grammarian",
    icon: <Crown size={16} />
  },

  {
    min: 100,
    label: "Linguistic Oracle",
    className: "oracle",
    icon: <Sparkles size={16} />
  },

  {
    min: 150,
    label: "Transcendent Sage",
    className: "sage",
    icon: <Flame size={16} />
  },

  {
    min: 220,
    label: "Vocabulary Vanguard",
    className: "vanguard",
    icon: <BookOpenCheck size={16} />
  },

  {
    min: 300,
    label: "Syntax Sorcerer",
    className: "sorcerer",
    icon: <Scroll size={16} />
  },

  {
    min: 400,
    label: "Phantom Poet",
    className: "poet",
    icon: <Feather size={16} />
  },

  {
    min: 550,
    label: "Mythic Mindmaster",
    className: "mindmaster",
    icon: <Brain size={16} />
  },

  {
    min: 750,
    label: "Ultimate Word Titan",
    className: "titan",
    icon: <Gem size={16} />
  },
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
  const [baseWord, setBaseWord] = useState("");
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [totalWords, setTotalWords] = useState(0);

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

  // ─── Load save ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(
      "wordwizard-save"
    );

    if (saved) {
      const data = JSON.parse(saved);

      setBaseWord(
        data.baseWord || getRandomBaseWord()
      );

      setFoundWords(data.foundWords || []);

      setTotalWords(data.totalWords || 0);
    } else {
      setBaseWord(getRandomBaseWord());
    }
  }, []);

  // ─── Save progress ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!baseWord) return;

    localStorage.setItem(
      "wordwizard-save",
      JSON.stringify({
        baseWord,
        foundWords,
        totalWords,
      })
    );
  }, [baseWord, foundWords, totalWords]);

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const roundCount = foundWords.length;

  const rank = getRank(totalWords);

 const nextRank =
  RANK_TIERS.find(
    (tier) => totalWords < tier.min
  );

const nextMilestone =
  nextRank?.min ?? "MAX";
 const currentRank =
  [...RANK_TIERS]
    .reverse()
    .find((tier) => totalWords >= tier.min);

const previousMin =
  currentRank?.min ?? 0;

const nextMin =
  nextRank?.min ?? previousMin;

const progressPct =
  nextMin === previousMin
    ? 100
    : ((totalWords - previousMin) /
        (nextMin - previousMin)) *
      100;

  const unlocked = roundCount >= 10;

  // ─── Load next word ────────────────────────────────────────────────────────
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

  // ─── UI helpers ────────────────────────────────────────────────────────────
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

  // ─── Share ─────────────────────────────────────────────────────────────────
  // ─── Share Image Generator ──────────────────────────────────────────────────
async function generateShareImage() {
  const canvas = document.createElement("canvas");

  canvas.width = 1200;
  canvas.height = 630;

  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  // Background
  const gradient = ctx.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height
  );

  gradient.addColorStop(0, "#0f172a");
  gradient.addColorStop(1, "#1e293b");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Glows
  for (let i = 0; i < 18; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    const radius =
      Math.random() * 120 + 40;

    const glow = ctx.createRadialGradient(
      x,
      y,
      0,
      x,
      y,
      radius
    );

    glow.addColorStop(
      0,
      "rgba(168,85,247,0.25)"
    );

    glow.addColorStop(1, "transparent");

    ctx.fillStyle = glow;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  // Main card
  ctx.fillStyle = "rgba(15,23,42,0.8)";

  roundRect(
    ctx,
    80,
    80,
    1040,
    470,
    38
  );

  ctx.fill();

  // Border
  ctx.strokeStyle =
    "rgba(168,85,247,0.7)";

  ctx.lineWidth = 5;

  roundRect(
    ctx,
    80,
    80,
    1040,
    470,
    38
  );

  ctx.stroke();

  // Stars
  ctx.fillStyle = "rgba(255,255,255,.8)";

  for (let i = 0; i < 80; i++) {
    ctx.beginPath();

    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 2,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  // Title
  ctx.textAlign = "center";

  ctx.fillStyle = "#ffffff";

  ctx.font = "bold 82px Arial";

  ctx.fillText(
    "🧙 WORD WIZARD",
    canvas.width / 2,
    210
  );

  // Words count
  ctx.fillStyle = "#cbd5e1";

  ctx.font = "42px Arial";

  ctx.fillText(
    `I discovered ${totalWords} words!`,
    canvas.width / 2,
    315
  );

  // Rank
  ctx.fillStyle = "#a855f7";

  ctx.font = "bold 54px Arial";

  ctx.fillText(
    rank.label || "Beginner",
    canvas.width / 2,
    405
  );

  // Footer
  ctx.fillStyle = "#94a3b8";

  ctx.font = "32px Arial";

  ctx.fillText(
    "Can you beat my vocabulary power?",
    canvas.width / 2,
    495
  );

  return new Promise<Blob | null>(
    (resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    }
  );
}

// ─── Rounded Rectangle Helper ───────────────────────────────────────────────
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();

  ctx.moveTo(x + radius, y);

  ctx.lineTo(
    x + width - radius,
    y
  );

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius
  );

  ctx.lineTo(
    x + width,
    y + height - radius
  );

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );

  ctx.lineTo(
    x + radius,
    y + height
  );

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius
  );

  ctx.lineTo(x, y + radius);

  ctx.quadraticCurveTo(
    x,
    y,
    x + radius,
    y
  );

  ctx.closePath();
}

// ─── Share ──────────────────────────────────────────────────────────────────
async function handleShare() {
  const imageBlob =
    await generateShareImage();

  if (!imageBlob) {
    showToast(
      "Couldn't generate image"
    );

    return;
  }

  const file = new File(
    [imageBlob],
    "wordwizard-score.png",
    {
      type: "image/png",
    }
  );

  const shareText = `🧙 I discovered ${totalWords} words in Word Wizard!

Can you beat my vocabulary power?

https://playcia.netlify.app/games/WordWizard`;

  if (
    navigator.canShare &&
    navigator.canShare({
      files: [file],
    })
  ) {
    try {
      await navigator.share({
        title: "Word Wizard",
        text: shareText,
        files: [file],
      });
    } catch {}
  } else {
    const url =
      URL.createObjectURL(imageBlob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      "wordwizard-score.png";

    a.click();

    showToast(
      "Share image downloaded!"
    );
  }
}
  // ─── Submit word ───────────────────────────────────────────────────────────
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

    setTotalWords((prev) => prev + 1);

    setNewChip(word);

    showMsg(`Nice — "${word}"!`, true);

    const newTotal = totalWords + 1;

    const milestones: Record<number, string> = {
      10: "Word Wizard unlocked!",
      20: "Lexicon Lord rises!",
      30: "Grand Grammarian achieved!",
      40: "Linguistic Oracle awakened!",
      50: "Transcendent Sage reached!",
      60: "Vocabulary Vanguard ascends!",
      70: "Syntax Sorcerer unleashed!",
      80: "Phantom Poet awakened!",
      90: "Mythic Mindmaster achieved!",
      100: "Ultimate Word Titan crowned!",
    };

    if (milestones[newTotal]) {
      setTimeout(() => {
        showToast(milestones[newTotal]);
      }, 200);
    }
  }

  // ─── Next word ─────────────────────────────────────────────────────────────
  function handleNext() {
    loadWord();
  }

  return (
    <>
      <div className={styles.root}>
        <p className={styles.eyebrow}>
          Make words from the letters below
        </p>

        <div className={styles.card}>
          <span className={styles.counter}>
            {roundCount} this round
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
                className={`${styles.rankBadge} ${styles[rank.className]}`}
              >
                {rank.icon}

                <span>{rank.label}</span>
              </span>
            )}
          </div>

          <div className={styles.progressMeta}>
            <span>
              {totalWords} total words discovered
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

          <button
            className={styles.shareBtn}
            onClick={handleShare}
          >
            <Share2 size={18} />

            <span>Share Progress</span>
          </button>
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