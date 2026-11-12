import React from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

export const ProjectStackCard = ({
  project,
  index = 0,
  onProjectClick,
}) => {
  const isBlue = index % 2 === 1;

  // Mengambil tag teknologi murni secara dinamis dari API projects
  const getTags = (item) => {
    if (!item) return [];
    if (Array.isArray(item.technologies) && item.technologies.length > 0) {
      return item.technologies;
    }
    if (Array.isArray(item.tech) && item.tech.length > 0) {
      return item.tech;
    }
    if (typeof item.technologies === 'string' && item.technologies.trim()) {
      return item.technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (typeof item.tech === 'string' && item.tech.trim()) {
      return item.tech.split(',').map((t) => t.trim()).filter(Boolean);
    }
    return [];
  };

  const tags = getTags(project);

  return (
    <article
      className="group relative w-full p-0 text-left cursor-pointer transition-colors duration-300"
      onClick={() => onProjectClick?.(project)}
      tabIndex={0}
      role="button"
      aria-label={`View project details for ${project.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onProjectClick?.(project);
        }
      }}
    >
      {/* Top Action Bar */}
      {project.url && (
        <div className={`flex items-center justify-end gap-2.5 pb-3 sm:pb-4 border-b ${isBlue ? 'border-violet-500/40' : 'border-[#127B99]/50'}`}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 transition-colors"
            title="Open External Repository / Demo"
          >
            <span>GITHUB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 lg:gap-8 pt-4 sm:pt-5 items-center">
        {/* Left Column: Typography & Narrative */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5">
          <div className="space-y-2.5">
            <h3 className={`text-2xl sm:text-3xl md:text-4xl lg:text-[2.35rem] font-extrabold text-white tracking-tight leading-[1.18] transition-colors duration-300 ${isBlue ? 'group-hover:text-violet-200' : 'group-hover:text-[#52d6fc]'
              }`}>
              {project.title}
            </h3>

            <p className="text-sm sm:text-base lg:text-[1rem] text-zinc-300 line-clamp-3 leading-relaxed font-normal">
              {project.fullDescription || project.subtitle}
            </p>

            {/* Dynamic Tech Tags rapat di sebelah kiri */}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2 mb-4 sm:mb-6 w-full max-w-fit">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-md font-semibold inline-flex flex-shrink-0 ${isBlue
                        ? 'bg-violet-950/70 border border-violet-500/50 text-violet-200 shadow-sm shadow-violet-900/40'
                        : 'bg-[#0e4453]/80 border border-[#127B99]/70 text-[#5ee3ff] shadow-sm shadow-[#127B99]/30'
                      }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onProjectClick?.(project);
              }}
              className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${isBlue
                  ? 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/40 border border-violet-400/30'
                  : 'bg-[#127B99] hover:bg-[#0e6179] shadow-[#127B99]/45 border border-[#127B99]/40'
                }`}
            >
              <span>Explore Project Case</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 transition-all"
              >
                <span>Live Repository</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Project Preview Canvas */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[16/10] min-h-[200px] sm:min-h-[230px] lg:min-h-[250px] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-700/50 bg-zinc-950 shadow-inner group/img">
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectStackCard;
