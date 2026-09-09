import { useMemo } from 'react';
import './InteractiveTicker.css';
import {
  FaLaptopCode,
  FaNetworkWired,
  FaDatabase,
  FaDocker,
  FaCloud,
  FaMobileAlt,
  FaShieldAlt,
  FaServer,
  FaLayerGroup,
  FaSyncAlt,
  FaBrain,
  FaCode,
  FaBug,
  FaRocket,
  FaTerminal,
} from 'react-icons/fa';

// Programmer domain skills & capabilities
const programmerCapabilities = [
  {
    id: 'cap-1',
    nama: 'Frontend Architecture',
    ket: 'Web Engineering',
    icon: <FaLaptopCode />,
    color: '#38bdf8',
  },
  {
    id: 'cap-2',
    nama: 'REST & GraphQL API',
    ket: 'Backend Engineering',
    icon: <FaNetworkWired />,
    color: '#34d399',
  },
  {
    id: 'cap-3',
    nama: 'Database Modeling',
    ket: 'Data Architecture',
    icon: <FaDatabase />,
    color: '#fbbf24',
  },
  {
    id: 'cap-4',
    nama: 'Docker & Container',
    ket: 'DevOps & Cloud',
    icon: <FaDocker />,
    color: '#60a5fa',
  },
  {
    id: 'cap-5',
    nama: 'Cloud Infrastructure',
    ket: 'GCP & Serverless',
    icon: <FaCloud />,
    color: '#818cf8',
  },
  {
    id: 'cap-6',
    nama: 'Mobile App Dev',
    ket: 'Android & Native',
    icon: <FaMobileAlt />,
    color: '#a78bfa',
  },
  {
    id: 'cap-7',
    nama: 'Web Security & Auth',
    ket: 'Cybersecurity',
    icon: <FaShieldAlt />,
    color: '#f87171',
  },
  {
    id: 'cap-8',
    nama: 'Microservices',
    ket: 'System Design',
    icon: <FaServer />,
    color: '#4ade80',
  },
  {
    id: 'cap-9',
    nama: 'Full-Stack Engineering',
    ket: 'Software Architecture',
    icon: <FaLayerGroup />,
    color: '#f472b6',
  },
  {
    id: 'cap-10',
    nama: 'CI/CD Pipelines',
    ket: 'DevOps Automation',
    icon: <FaSyncAlt />,
    color: '#2dd4bf',
  },
  {
    id: 'cap-11',
    nama: 'AI & Prompt Eng.',
    ket: 'LLM & Gemini API',
    icon: <FaBrain />,
    color: '#c084fc',
  },
  {
    id: 'cap-12',
    nama: 'Clean Code & OOP',
    ket: 'Design Patterns',
    icon: <FaCode />,
    color: '#38bdf8',
  },
  {
    id: 'cap-13',
    nama: 'Testing & QA',
    ket: 'Unit & End-to-End',
    icon: <FaBug />,
    color: '#fb7185',
  },
  {
    id: 'cap-14',
    nama: 'Performance Tuning',
    ket: 'Core Web Vitals',
    icon: <FaRocket />,
    color: '#f59e0b',
  },
  {
    id: 'cap-15',
    nama: 'Linux & Scripting',
    ket: 'CLI & Automation',
    icon: <FaTerminal />,
    color: '#a3e635',
  },
];

const rowConfigs = [
  { className: 'row-speed-1', label: 'Row 1 (26s - Right)' },
  { className: 'row-speed-2', label: 'Row 2 (36s - Left)' },
  { className: 'row-speed-3', label: 'Row 3 (48s - Right)' },
  { className: 'row-speed-4', label: 'Row 4 (30s - Left)' },
  { className: 'row-speed-5', label: 'Row 5 (42s - Right)' },
];

const InteractiveTicker = ({ tools = [] }) => {
  // Merge existing tools with programmer capabilities and distribute into 5 rows
  const rows = useMemo(() => {
    // Interleave tools and capabilities for maximum visual variety in each row
    const combined = [];
    const maxLen = Math.max(tools.length, programmerCapabilities.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < tools.length) combined.push(tools[i]);
      if (i < programmerCapabilities.length) combined.push(programmerCapabilities[i]);
    }

    const quintile = Math.ceil(combined.length / 5);
    return [
      combined.slice(0, quintile),
      combined.slice(quintile, quintile * 2),
      combined.slice(quintile * 2, quintile * 3),
      combined.slice(quintile * 3, quintile * 4),
      combined.slice(quintile * 4),
    ];
  }, [tools]);

  return (
    <div className="interactive-ticker-mask">
      <div className="interactive-ticker-wrapper">
        {rows.map((rowTools, rowIndex) => {
          // Duplicate items for seamless continuous marquee loop
          const items = [...rowTools, ...rowTools, ...rowTools, ...rowTools];
          const config = rowConfigs[rowIndex] || rowConfigs[0];

          return (
            <div
              key={rowIndex}
              className={`interactive-ticker-row ${config.className}`}
            >
              {items.map((tool, index) => (
                <div key={`${tool.id}-${index}`} className="interactive-ticker-item">
                  {tool.icon ? (
                    <div
                      className="tool-icon-wrapper"
                      style={{ color: tool.color || '#38bdf8' }}
                    >
                      {tool.icon}
                    </div>
                  ) : tool.gambar ? (
                    <img src={tool.gambar} alt={tool.nama} />
                  ) : (
                    <div className="tool-icon-wrapper text-violet-400">
                      <FaCode />
                    </div>
                  )}
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
