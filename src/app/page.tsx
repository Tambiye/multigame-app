import Link from "next/link";
import {
  WandSparkles,
  Brain,
  Zap,
  Layers3,
  Sigma,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const games = [
  {
    title: "Word Wizard",
    href: "/games/WordWizard",
    badge: "Vocabulary",
    description:
      "Turn letters into powerful words, build streaks, and rise through the ranks of the ultimate word master.",
    icon: WandSparkles,
  },
  {
    title: "Math Quiz",
    href: "/games/math-quiz",
    badge: "Brain Boost",
    description:
      "Push your mind to the limit with fast-paced math challenges, score multipliers, and survival-based gameplay.",
    icon: Brain,
  },
  {
    title: "Reaction Game",
    href: "/games/reaction-game",
    badge: "Speed Test",
    description:
      "Challenge your reflexes, react in milliseconds, and see how fast your mind and hands really are.",
    icon: Zap,
  },
  {
    title: "Memory Match",
    href: "/games/memory-match",
    badge: "Focus",
    description:
      "Flip, memorize, and match every card while racing against time and sharpening your concentration.",
    icon: Layers3,
  },
  {
    title: "Word Scramble",
    href: "/games/word-builder",
    badge: "Puzzle",
    description:
      "Unscramble hidden words, expand your vocabulary, and solve increasingly tricky word combinations.",
    icon: Sigma,
  },
];

export default function Home() {
  return (
    <main className="page-shell">
      <div className="container">
        <section className="hero-stack">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Interactive Learning Games</span>
          </div>

          {/* <h1 className="heading-hero">
            Play Smarter.
            <br />
            Learn Faster.
          </h1> */}
{/* 
          <p className="text-muted hero-text">
  Fun mini-games built to sharpen your mind, improve reflexes, and make learning enjoyable.
</p> */}
        </section>

        <section className="grid-auto-fit">
          {games.map((game) => {
            const Icon = game.icon;

            return (
              <Link
                key={game.title}
                href={game.href}
                className="game-card"
              >
                <div className="card-top">
                  <div className="icon-wrap">
                    <Icon size={24} />
                  </div>

                  <span className="badge">{game.badge}</span>
                </div>

                <div className="card-content">
                  <h2 className="card-title">{game.title}</h2>

                  <p className="text-muted">
                    {game.description}
                  </p>
                </div>

                <div className="card-footer">
                  <span className="play-link">
                    Play Now
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}