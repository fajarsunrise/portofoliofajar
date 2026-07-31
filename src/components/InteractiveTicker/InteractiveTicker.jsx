import { useMemo } from 'react';
import './InteractiveTicker.css';

const InteractiveTicker = ({ tools = [] }) => {
  // Split tools into 3 roughly equal groups
  const rows = useMemo(() => {
    const third = Math.ceil(tools.length / 3);
    return [
      tools.slice(0, third),
      tools.slice(third, third * 2),
      tools.slice(third * 2),
    ];
  }, [tools]);

  const rowConfigs = [
    { className: 'row-right', label: 'Row 1' },
    { className: 'row-left', label: 'Row 2' },
    { className: 'row-right-slow', label: 'Row 3' },
  ];

  return (
    <div className="interactive-ticker-mask">
      <div className="interactive-ticker-wrapper">
        {rows.map((rowTools, rowIndex) => {
          // Duplicate items for seamless loop
          const items = [...rowTools, ...rowTools, ...rowTools, ...rowTools];
          const config = rowConfigs[rowIndex];

          return (
            <div
              key={rowIndex}
              className={`interactive-ticker-row ${config.className}`}
            >
              {items.map((tool, index) => (
                <div key={`${tool.id}-${index}`} className="interactive-ticker-item">
                  <img src={tool.gambar} alt={tool.nama} />
                  <div className="flex flex-col">
                    <span className="tool-name">{tool.nama}</span>
                    <span className="tool-category">{tool.ket}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveTicker;
