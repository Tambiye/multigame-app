type Props = {
  title: string;
  description: string;
  time: string;
};

export default function GameCard({ title, description, time }: Props) {
  return (
    <div
      className="card-hover"
      style={{
        background: "white",
        padding: "1.5rem",
        borderRadius: "1rem",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <span className="timer-badge">{time}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="primary-button">Play Now</button>
    </div>
  );
}