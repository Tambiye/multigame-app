type Props = {
  title: string;
  children: React.ReactNode;
};

export default function Section({ title, children }: Props) {
  return (
    <section className="section">
      <div className="container">
        <h2 className="heading-xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}