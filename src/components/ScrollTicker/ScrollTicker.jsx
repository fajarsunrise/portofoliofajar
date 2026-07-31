import './ScrollTicker.css';

const tickerItems = [
  "Full-Stack Developer",
  "Front-End Developer",
  "React Developer",
  "UI/UX Designer",
  "Next.js",
  "TypeScript",
  "Machine Learning",
  "Artificial Intelligence",
  "Problem Solver",
];

const ScrollTicker = () => {
  // Duplicate items for seamless loop
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="scroll-ticker-wrapper my-16">
      <div className="scroll-ticker-track">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="scroll-ticker-item">
              <span className="text-violet-400">✦</span>
              {item}
            </div>
            {index < items.length - 1 && (
              <div className="scroll-ticker-divider">⬥</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollTicker;
