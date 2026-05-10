"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/styles/math-quiz.module.css";

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

// ─────────────────────────────────────────────────────────────
// WORD PROBLEM TEMPLATES
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
// RANDOM HELPERS
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

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function MathQuizPage() {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const [userAnswer, setUserAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const [questionCount, setQuestionCount] = useState(0);

  const [feedback, setFeedback] = useState("");

  const [lives, setLives] = useState(MAX_LIVES);

  const [lastLifeLostAt, setLastLifeLostAt] = useState<number | null>(null);

  // ─────────────────────────────────────────────────────────────
  // DIFFICULTY SCALE
  // ─────────────────────────────────────────────────────────────
  const difficulty = useMemo(() => {
    return {
      min: level * 2,
      max: level * 25,
    };
  }, [level]);

  // ─────────────────────────────────────────────────────────────
  // LIFE REFILL SYSTEM
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (lives >= MAX_LIVES || !lastLifeLostAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - lastLifeLostAt;

      if (diff >= LIFE_REFILL_MINUTES * 60 * 1000) {
        setLives((prev) => Math.min(prev + 1, MAX_LIVES));
        setLastLifeLostAt(Date.now());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lives, lastLifeLostAt]);

  // ─────────────────────────────────────────────────────────────
  // TIMER FOR NEXT LIFE
  // ─────────────────────────────────────────────────────────────
  const refillCountdown = useMemo(() => {
    if (!lastLifeLostAt || lives >= MAX_LIVES) return null;

    const remaining =
      LIFE_REFILL_MINUTES * 60 -
      Math.floor((Date.now() - lastLifeLostAt) / 1000);

    const mins = Math.max(0, Math.floor(remaining / 60));
    const secs = Math.max(0, remaining % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [lastLifeLostAt, lives]);

  // ─────────────────────────────────────────────────────────────
  // QUESTION GENERATOR
  // ─────────────────────────────────────────────────────────────
  const generateQuestion = () => {
    const availableOperations: Operation[] =
      level <= 2
        ? ["add", "subtract"]
        : level <= 4
        ? ["add", "subtract", "multiply"]
        : level <= 6
        ? ["add", "subtract", "multiply", "divide"]
        : ["add", "subtract", "multiply", "divide", "power", "mixed"];

    const selectedOperation = randomItem(availableOperations);

    const category = puzzleBank.find(
      (item) => item.operation === selectedOperation
    )!;

    const template = randomItem(category.templates);

    const num1 = rand(difficulty.min, difficulty.max);
    const num2 = rand(2, Math.max(5, difficulty.max / 2));
    const num3 = rand(1, Math.max(10, difficulty.max / 3));

    const name = randomItem(names);

    let answer = 0;

    switch (selectedOperation) {
      case "add":
        answer = num1 + num2;
        break;

      case "subtract":
        answer = num1 - num2;
        break;

      case "multiply":
        answer = num1 * num2;
        break;

      case "divide":
        answer = num1 * num2;
        break;

      case "power":
        answer = Math.pow(
          rand(2, Math.min(6, level + 2)),
          rand(2, 3)
        );
        break;

      case "mixed":
        answer = num1 * num2 - num3;
        break;
    }

    let finalQuestion = template
      .replace("{name}", name)
      .replace("{num1}", String(num1))
      .replace("{num2}", String(num2))
      .replace("{num3}", String(num3));

    if (selectedOperation === "divide") {
      finalQuestion = template
        .replace("{name}", name)
        .replace("{num1}", String(answer))
        .replace("{num2}", String(num2));

      answer = answer / num2;
    }

    if (selectedOperation === "power") {
      const base = rand(2, 5);
      const exponent = rand(2, 3);

      finalQuestion = template
        .replace("{name}", name)
        .replace("{num1}", String(base))
        .replace("{num2}", String(exponent));

      answer = Math.pow(base, exponent);
    }

    setQuestion(finalQuestion);
    setCorrectAnswer(answer);
  };

  // ─────────────────────────────────────────────────────────────
  // LOAD QUESTION
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    generateQuestion();
  }, [level]);

  // ─────────────────────────────────────────────────────────────
  // NEXT QUESTION
  // ─────────────────────────────────────────────────────────────
  const nextQuestion = () => {
    const nextCount = questionCount + 1;

    setQuestionCount(nextCount);

    if (nextCount % QUESTIONS_PER_LEVEL === 0) {
      setLevel((prev) => prev + 1);
      setFeedback("🚀 LEVEL UP!");
    } else {
      generateQuestion();
    }
  };

  // ─────────────────────────────────────────────────────────────
  // SUBMIT ANSWER
  // ─────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    const parsed = Number(userAnswer);

    if (parsed === correctAnswer) {
      setScore((prev) => prev + level * 10);

      setFeedback("✅ Correct!");

      setTimeout(() => {
        nextQuestion();
      }, 500);
    } else {
      setLives((prev) => prev - 1);

      setLastLifeLostAt(Date.now());

      setFeedback(`❌ Wrong! Correct answer: ${correctAnswer}`);
    }

    setUserAnswer("");

    setTimeout(() => {
      setFeedback("");
    }, 1500);
  };

  // ─────────────────────────────────────────────────────────────
  // RESET
  // ─────────────────────────────────────────────────────────────
  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setQuestionCount(0);
    setLives(MAX_LIVES);
    setFeedback("");
    setUserAnswer("");
    generateQuestion();
  };

  // ─────────────────────────────────────────────────────────────
  // GAME OVER
  // ─────────────────────────────────────────────────────────────
  if (lives <= 0) {
    return (
      <main className={styles.gameOver}>
        <div className={styles.gameOverCard}>
          <h1>💀 GAME OVER</h1>

          <p>Your score: {score}</p>

          <p>Highest level: {level}</p>

          <button onClick={resetGame} className={styles.playAgain}>
            Play Again
          </button>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────────
  return (
    <main className={styles.wrapper}>
      <section className={styles.quizCard}>
        <div className={styles.topBar}>
          <div className={styles.level}>
            <span>Level</span>
            <strong>{level}</strong>
          </div>

          <div className={styles.score}>
            <span>Score</span>
            <strong>{score}</strong>
          </div>
        </div>

        <div className={styles.hearts}>
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i}>❤️</span>
          ))}
        </div>

        {lives < MAX_LIVES && (
          <p className={styles.refill}>
            ⏳ Next life in {refillCountdown}
          </p>
        )}

        <div className={styles.progress}>
          Question {(questionCount % QUESTIONS_PER_LEVEL) + 1} /{" "}
          {QUESTIONS_PER_LEVEL}
        </div>

        <div className={styles.questionBox}>
          <p>{question}</p>
        </div>

        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type answer..."
          className={styles.answerInput}
        />

        <button onClick={handleSubmit} className={styles.submitBtn}>
          Submit Answer
        </button>

        {feedback && <p className={styles.feedback}>{feedback}</p>}
      </section>
    </main>
  );
}