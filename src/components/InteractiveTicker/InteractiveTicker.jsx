import { useMemo } from 'react';
import './InteractiveTicker.css';
import { FaCode } from 'react-icons/fa';

/**
 * Helper untuk memastikan array cukup panjang sebelum diduplikasi,
 * agar perpindahan 0% -> -50% benar-benar seamless di segala resolusi layar.
 */
const buildSeamlessLoop = (list) => {
  if (!list || list.length === 0) return [];
  let base = [...list];
  // Jika item sedikit, ulangi hingga minimal 6 item di separuh loop
  while (base.length < 6) {
    base = [...base, ...list];
  }
  // Duplikasi tepat dua kali untuk seamless loop (-50%)
  return [...base, ...base];
};

const InteractiveTicker = ({ tools = [] }) => {
  // Pisahkan array tools dari API menjadi dua kelompok: Baris 1 (Atas) dan Baris 2 (Bawah)
  const { row1Items, row2Items } = useMemo(() => {
    if (!Array.isArray(tools) || tools.length === 0) {
      return { row1Items: [], row2Items: [] };
    }

    const half = Math.ceil(tools.length / 2);
    const row1 = tools.slice(0, half);
    const row2 = tools.slice(half);

    // Jika row2 kosong (misal cuma ada 1 tool), gunakan row1
    const finalRow2 = row2.length > 0 ? row2 : row1;

    return {
      row1Items: buildSeamlessLoop(row1),
      row2Items: buildSeamlessLoop(finalRow2),
    };
  }, [tools]);

  if (!tools || tools.length === 0) {
    return (
      <div className="text-center text-white/40 py-8">
        Memuat data tools dari server...
      </div>
    );
  }

  const renderToolCard = (tool, index, prefix) => {
    const toolName = tool.name || tool.nama || "Tool";
    const toolIcon = tool.icon_url || tool.gambar;
    const toolCategory = tool.category || tool.ket || "Technology";

    return (
      <div
        key={`${prefix}-${tool.id || index}-${index}`}
        className="interactive-ticker-item"
      >
        {toolIcon ? (
          <img
            src={toolIcon}
            alt={toolName}
            className="w-8 h-8 object-contain"
          />
        ) : (
          <div className="tool-icon-wrapper text-violet-400">
            <FaCode />
          </div>
        )}
        <div className="flex flex-col">
          <span className="tool-name">{toolName}</span>
          <span className="tool-category">{toolCategory}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="interactive-ticker-mask w-full overflow-hidden relative">
      <div className="interactive-ticker-wrapper">
        {/* Baris 1 (Atas): Bergerak terus-menerus ke KIRI */}
        <div className="interactive-ticker-row ticker-row-left">
          {row1Items.map((tool, idx) => renderToolCard(tool, idx, "r1"))}
        </div>

        {/* Baris 2 (Bawah): Bergerak terus-menerus ke KANAN */}
        <div className="interactive-ticker-row ticker-row-right">
          {row2Items.map((tool, idx) => renderToolCard(tool, idx, "r2"))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveTicker;
