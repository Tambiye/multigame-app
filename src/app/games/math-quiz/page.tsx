"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import "@/styles/math-quiz.css";
import {
  Star,
  Trophy,
  Share2
} from "lucide-react";
// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type Operation =
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "power"
  | "mixed";

type FeedbackType = "correct" | "wrong" | "levelup" | "";

interface PuzzleTemplate {
  operation: Operation;
  templates: string[];
}

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const QUESTIONS_PER_LEVEL = 10;
const MAX_LIVES = 5;
const LIFE_REFILL_MINUTES = 10;
const STORAGE_KEY = "math-quiz-save";
// ─────────────────────────────────────────────────────────────
// PUZZLE BANK
// ─────────────────────────────────────────────────────────────
const puzzleBank: PuzzleTemplate[] = [
  {
    operation: "add",
    templates: [
      "{name} scored {num1} points in the first round and {num2} in the second. Total?",
      "A warehouse received {num1} boxes in the morning and {num2} later. How many now?",
      "{name} saved ₦{num1} and then earned ₦{num2} more. Total savings?",
      "A game character collected {num1} gems and discovered {num2} hidden gems. Total?",
    ],
  },
  {
    operation: "subtract",
    templates: [
      "{name} had {num1} energy points and used {num2}. Remaining?",
      "A train carried {num1} passengers, then {num2} got off. How many left?",
      "{name} owned {num1} books and donated {num2}. Remaining books?",
      "A tank contained {num1} liters of water. {num2} liters leaked out. Left?",
    ],
  },
  {
    operation: "multiply",
    templates: [
      "{name} bought {num1} packs with {num2} candies each. Total candies?",
      "A hall has {num1} rows with {num2} chairs each. Total chairs?",
      "{num1} robots each built {num2} gadgets. Total gadgets?",
      "A farmer planted {num1} trees in each of {num2} fields. Total trees?",
    ],
  },
  {
    operation: "divide",
    templates: [
      "{num1} cookies are shared equally among {num2} kids. How many each?",
      "{name} earned ₦{num1} and split it evenly among {num2} friends. Each gets?",
      "A factory packed {num1} items into {num2} boxes equally. Items per box?",
      "{num1} students are grouped into teams of {num2}. How many per team?",
    ],
  },
  {
    operation: "power",
    templates: [
      "A magic crystal doubles in power every hour. After {num2} hours, what is {num1}^{num2}?",
      "{name} upgrades a weapon to level {num2}. Calculate {num1}^{num2}.",
      "A computer multiplies its speed by itself {num2} times. Find {num1}^{num2}.",
    ],
  },
  {
    operation: "mixed",
    templates: [
      "{name} bought {num1} boxes with {num2} pens each, then lost {num3}. How many left?",
      "A gamer earned {num1} coins daily for {num2} days and spent {num3}. Coins left?",
      "A bakery made {num1} trays with {num2} cupcakes each and sold {num3}. Remaining cupcakes?",
      "{name} completed {num1} missions worth {num2} XP each and lost {num3} XP in battle. Total XP?",
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const names = [
  "Alex",
  "Jordan",
  "Taylor",
  "Kai",
  "Zara",
  "Noah",
  "Mia",
  "Leo",
  "Nova",
  "Ethan",
  "Emeka",
  "Chinelo",
  "Ayo",
  "Sade",
  "Tunde",
];

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomItem = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export default function MathQuizPage() {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [currentOp, setCurrentOp] = useState<Operation>("add");

  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [questionCount, setQuestionCount] = useState(0);

  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("");

  const [lives, setLives] = useState(MAX_LIVES);
  const [lastLifeLostAt, setLastLifeLostAt] = useState<number | null>(null);

  const [questionAnim, setQuestionAnim] = useState<
    "shake" | "pop" | ""
  >("");

  const inputRef = useRef<HTMLInputElement>(null);
  const shareCanvasRef =
  useRef<HTMLCanvasElement | null>(null);

  const difficulty = useMemo(
    () => ({
      min: level * 2,
      max: level * 25,
    }),
    [level]
  );

  useEffect(() => {
    if (lives >= MAX_LIVES || !lastLifeLostAt) return;

    const interval = setInterval(() => {
      const diff = Date.now() - lastLifeLostAt;

      if (diff >= LIFE_REFILL_MINUTES * 60 * 1000) {
        setLives((p) => Math.min(p + 1, MAX_LIVES));
        setLastLifeLostAt(Date.now());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lives, lastLifeLostAt]);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const refillCountdown = useMemo(() => {
    if (!lastLifeLostAt || lives >= MAX_LIVES) return null;

    const remaining =
      LIFE_REFILL_MINUTES * 60 -
      Math.floor((Date.now() - lastLifeLostAt) / 1000);

    const mins = Math.max(0, Math.floor(remaining / 60));
    const secs = Math.max(0, remaining % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [lastLifeLostAt, lives, tick]);

  const generateQuestion = useCallback(
    (lvl: number, diff: { min: number; max: number }) => {
      const availableOps: Operation[] =
        lvl <= 2
          ? ["add", "subtract"]
          : lvl <= 4
          ? ["add", "subtract", "multiply"]
          : lvl <= 6
          ? ["add", "subtract", "multiply", "divide"]
          : ["add", "subtract", "multiply", "divide", "power", "mixed"];

      const op = randomItem(availableOps);
      const category = puzzleBank.find((i) => i.operation === op)!;
      const template = randomItem(category.templates);

    const num1 = rand(diff.min, diff.max);

// num2 always smaller than num1
const num2 = rand(1, Math.max(1, num1 - 1));

const num3 = rand(1, Math.max(10, diff.max / 3));
const name = randomItem(names);

      let answer = 0;

      let finalQuestion = template
        .replace("{name}", name)
        .replace("{num1}", String(num1))
        .replace("{num2}", String(num2))
        .replace("{num3}", String(num3));

      switch (op) {
        case "add":
          answer = num1 + num2;
          break;

        case "subtract":
          answer = num1 - num2;
          break;

        case "multiply":
          answer = num1 * num2;
          break;

        case "mixed":
          answer = num1 * num2 - num3;
          break;

        case "divide": {
          const product = num1 * num2;

          finalQuestion = template
            .replace("{name}", name)
            .replace("{num1}", String(product))
            .replace("{num2}", String(num2));

          answer = num1;
          break;
        }

        case "power": {
          const base = rand(2, 5);
          const exp = rand(2, 3);

          finalQuestion = template
            .replace("{name}", name)
            .replace("{num1}", String(base))
            .replace("{num2}", String(exp));

          answer = Math.pow(base, exp);
          break;
        }
      }

      setCurrentOp(op);
      setQuestion(finalQuestion);
      setCorrectAnswer(answer);
    },
    []
  );
useEffect(() => {
  const saved =
    localStorage.getItem(STORAGE_KEY);

  if (saved) {
    const data = JSON.parse(saved);

    setQuestion(data.question);
    setCorrectAnswer(data.correctAnswer);
    setCurrentOp(data.currentOp);

    setScore(data.score);
    setLevel(data.level);
    setQuestionCount(data.questionCount);

    setLives(data.lives);
    setLastLifeLostAt(data.lastLifeLostAt);

    return;
  }

  generateQuestion(1, {
    min: 2,
    max: 25,
  });
}, [generateQuestion]);

useEffect(() => {
  if (!question) return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      question,
      correctAnswer,
      currentOp,
      score,
      level,
      questionCount,
      lives,
      lastLifeLostAt,
    })
  );
}, [
  question,
  correctAnswer,
  currentOp,
  score,
  level,
  questionCount,
  lives,
  lastLifeLostAt,
]);

  const handleSubmit = useCallback(() => {
    if (!userAnswer.trim()) return;

    const parsed = Number(userAnswer);

    if (parsed === correctAnswer) {
      setScore((p) => p + level * 10);
      setFeedbackType("correct");
      setFeedbackText(`✅ Correct! +${level * 10} pts`);
      setQuestionAnim("pop");

      const nextCount = questionCount + 1;
      setQuestionCount(nextCount);

      setTimeout(() => {
        setQuestionAnim("");

        if (nextCount % QUESTIONS_PER_LEVEL === 0) {
          const nextLevel = level + 1;

          setLevel(nextLevel);
          setFeedbackType("levelup");
          setFeedbackText(`🚀 Level ${nextLevel}! Keep going!`);

          generateQuestion(nextLevel, {
            min: nextLevel * 2,
            max: nextLevel * 25,
          });
        } else {
          generateQuestion(level, difficulty);
        }

        setFeedbackText("");
        setFeedbackType("");
      }, 900);
    } else {
      setLives((p) => p - 1);
      setLastLifeLostAt(Date.now());

      setFeedbackType("wrong");
      setFeedbackText(`❌ Nope! Try Again!`);
      setQuestionAnim("shake");

      setTimeout(() => {
        setQuestionAnim("");
        setFeedbackText("");
        setFeedbackType("");
      }, 1600);
    }

    setUserAnswer("");

    setTimeout(() => inputRef.current?.focus(), 50);
  }, [
    userAnswer,
    correctAnswer,
    level,
    questionCount,
    difficulty,
    generateQuestion,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit]
  );

  const resetGame = useCallback(() => { localStorage.removeItem(STORAGE_KEY);
    setScore(0);
    setLevel(1);
    setQuestionCount(0);
    setLives(MAX_LIVES);
    setFeedbackText("");
    setFeedbackType("");
    setUserAnswer("");
    setLastLifeLostAt(null);

    generateQuestion(1, { min: 2, max: 25 });
  }, [generateQuestion]);
  async function handleShare() {
  const shareText = `🧠 I scored ${score} points in Math Master!

🔥 Reached Level ${level}
📘 Solved ${questionCount} questions

Can you beat my score?

https://playcia.netlify.app/games/math-quiz`;

  try {
    const blob =
      await generateShareImage();

    if (!blob) return;

    const file = new File(
      [blob],
      "math-master-score.png",
      {
        type: "image/png",
      }
    );

    if (
      navigator.share &&
      navigator.canShare({
        files: [file],
      })
    ) {
      await navigator.share({
        title: "Math Master",
        text: shareText,
        files: [file],
      });
    } else {
      await navigator.clipboard.writeText(
        shareText
      );

      setFeedbackText(
        "📋 Share text copied!"
      );

      setFeedbackType("correct");
    }
  } catch (err) {
    console.log(err);
  }
}
async function generateShareImage() {
  const canvas =
    shareCanvasRef.current;

  if (!canvas) return null;

  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  canvas.width = 1200;
  canvas.height = 630;

  // Background
  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );

  gradient.addColorStop(0, "#0f172a");
  gradient.addColorStop(1, "#1e293b");

  ctx.fillStyle = gradient;
  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Glow
  ctx.fillStyle =
    "rgba(59,130,246,0.25)";

  ctx.beginPath();
  ctx.arc(250, 180, 180, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(980, 500, 220, 0, Math.PI * 2);
  ctx.fill();

  // Title
  ctx.textAlign = "center";

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 72px Arial";

  ctx.fillText(
    "🧠 Math Master",
    canvas.width / 2,
    140
  );

  // Card
  roundRect(
    ctx,
    180,
    190,
    840,
    260,
    30
  );

  ctx.fillStyle =
    "rgba(255,255,255,0.08)";

  ctx.fill();

  // Score
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 54px Arial";

  ctx.fillText(
    `${score.toLocaleString()} Points`,
    canvas.width / 2,
    290
  );

  // Level
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px Arial";

  ctx.fillText(
    `Level ${level}`,
    canvas.width / 2,
    360
  );

  // Questions
  ctx.fillStyle = "#94a3b8";
  ctx.font = "36px Arial";

  ctx.fillText(
    `${questionCount} Questions Solved`,
    canvas.width / 2,
    420
  );

  // Footer
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 34px Arial";

  ctx.fillText(
    "Can you beat my math score?",
    canvas.width / 2,
    540
  );

  return new Promise<Blob | null>(
    (resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    }
  );
}

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

  ctx.lineTo(
    x,
    y + radius
  );

  ctx.quadraticCurveTo(
    x,
    y,
    x + radius,
    y
  );

  ctx.closePath();
}
  const progressPct =
    ((questionCount % QUESTIONS_PER_LEVEL) / QUESTIONS_PER_LEVEL) * 100;

  const opLabels: Record<Operation, string> = {
    add: "➕ Addition",
    subtract: "➖ Subtraction",
    multiply: "✖️ Multiplication",
    divide: "➗ Division",
    power: "⚡ Powers",
    mixed: "🔀 Mixed",
  };

  if (lives <= 0) {
    return (
      <main className="mq-gameover">
        <div className="mq-gameover-card">
          <span className="mq-gameover-skull">💀</span>

          <h1 className="mq-gameover-title">Game Over</h1>

          <div className="mq-gameover-stats">
            <div className="mq-gameover-stat">
              <span className="num">{score}</span>
              <span className="lbl">Final Score</span>
            </div>

            <div className="mq-gameover-stat">
              <span className="num">{level}</span>
              <span className="lbl">Highest Level</span>
            </div>

            <div className="mq-gameover-stat">
              <span className="num">{questionCount}</span>
              <span className="lbl">Answered</span>
            </div>
          </div>

          <button onClick={resetGame} className="mq-play-again">
            Play Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mq-root">
      <section className="mq-card">
        <div className="mq-header">
        
       
          <div className="mq-stat">
         <div className="mq-stat-icon level">
  <Trophy size={18} />
</div>

            <div>
              <div className="mq-stat-label">Level</div>
              <div className="mq-stat-value">{level}</div>
            </div>
          </div>

          <div className="mq-stat">
            <div className="mq-stat-icon score">
  <Star size={18} />
</div>
            <div>
              <div className="mq-stat-label">Score</div>
              <div className="mq-stat-value">
                {score.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mq-live-container"><div className="mq-lives">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span
              key={i}
              className={`mq-heart${i >= lives ? " lost" : ""}`}
            >
              ❤️
            </span>
          ))}
        </div>
            {lives < MAX_LIVES && refillCountdown && (
          <p className="mq-refill">
            ⏳ Next life in {refillCountdown}
          </p>
        )}
        </div>
           

      

        </div>
      

        <div className="mq-progress-row">
          <span className="mq-progress-label">
            Question {(questionCount % QUESTIONS_PER_LEVEL) + 1} /{" "}
            {QUESTIONS_PER_LEVEL}
          </span>

          <span className="mq-progress-pct">
            {Math.round(progressPct)}%
          </span>
        </div>

        <div className="mq-bar">
          <div
            className="mq-bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <span className="mq-op-badge">
            {opLabels[currentOp]}
          </span>
        </div>

        <div
          className={`mq-question${
            questionAnim ? ` ${questionAnim}` : ""
          }`}
        >
          <p>{question}</p>
        </div>

    <input
  ref={inputRef}
  type="text"
  inputMode="decimal"
  value={userAnswer}
  onChange={(e) => setUserAnswer(e.target.value)}
  onKeyDown={handleKeyDown}
  placeholder="0"
  className="mq-input"
  autoFocus
/>
  {feedbackText && (
          <div className={`mq-feedback ${feedbackType}`}>
            {feedbackText}
          </div>
        )}
        <button
          onClick={handleSubmit}
          className="mq-btn"
          // disabled={!userAnswer.trim()}
        >
          Answer
        </button>

      
        <button
  onClick={handleShare}
  className="mq-share-btn"
>
  <Share2 size={18} />

  <span>Share Score</span>
</button>
      </section>
      <canvas
  ref={shareCanvasRef}
  style={{ display: "none" }}
/>
    </main>
  );
}