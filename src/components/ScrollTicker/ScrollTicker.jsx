import './ScrollTicker.css';

const ScrollTicker = ({ text = "" }) => {
  // Parse marquee_text from API heroes (split by bullet, comma, slash, or pipe)
  const itemsList = text && typeof text === 'string'
    ? text.split(/[•|,/]/).map((t) => t.trim()).filter(Boolean)
    : [];

  const displayList = itemsList.length > 0 ? itemsList : (text ? [text] : []);

  // Duplicate items for seamless loop
  const items = [...displayList, ...displayList, ...displayList, ...displayList];

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
