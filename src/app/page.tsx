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
      "Build words from letters, grow streaks, and master vocabulary skills.",
    icon: WandSparkles,
  },
  {
    title: "Math Quiz",
    href: "/games/math-quiz",
    badge: "Brain Boost",
    description:
      "Solve fast math challenges, earn points, and test mental speed.",
    icon: Brain,
  },
  {
    title: "Reaction Game",
    href: "/games/reaction-game",
    badge: "Speed Test",
    description:
      "Test reflex speed, react quickly, and improve timing under pressure.",
    icon: Zap,
  },
  {
    title: "Memory Match",
    href: "/games/memory-match",
    badge: "Focus",
    description:
      "Flip cards, remember positions, and match pairs against the clock.",
    icon: Layers3,
  },
  {
    title: "Word Scramble",
    href: "/games/word-builder",
    badge: "Puzzle",
    description:
      "Unscramble letters, find words, and solve tricky vocabulary puzzles.",
    icon: Sigma,
  },
];

export default function Home() {
  return (
    <main className="page-shell">
      <div className="container">
        <section className="hero-stack">
          <div className="hero-badge">
            <Sparkles size={20} />
            <span>Featured Games</span>
          </div>
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