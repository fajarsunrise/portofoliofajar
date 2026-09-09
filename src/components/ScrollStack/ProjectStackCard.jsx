import React from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

export const ProjectStackCard = ({
  project,
  onProjectClick,
}) => {
  // Derive contextual tags from project data
  const getTags = (item) => {
    const tagsMap = {
      1: ['AI / ML', 'Healthcare', 'Computer Vision'],
      2: ['IoT System', 'Air Quality', 'Hardware'],
      3: ['Telemedicine', 'Sensors', 'Real-time Web'],
      4: ['Creative Dev', 'Editorial UI', 'Full-stack'],
      5: ['Accessibility', 'Vision Health', 'Cross-Platform'],
      6: ['E-Commerce', 'Next.js', 'UI/UX Design'],
    };
    return tagsMap[item.id] || ['Engineering', 'Design', 'Architecture'];
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
      {/* Top Action Bar without numbers and brackets */}
      <div className="flex items-center justify-end gap-2.5 pb-3 sm:pb-4 border-b border-violet-500/20">
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/40 transition-colors"
            title="Open External Repository / Demo"
          >
            <span>GITHUB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        <span className="text-xs sm:text-sm font-mono text-violet-400 opacity-90 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex items-center gap-1">
          VIEW DETAILS
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>

      {/* Main Content Grid with tightened spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 lg:gap-8 pt-4 sm:pt-5 items-center">
        {/* Left Column: Typography & Narrative */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5">
          <div className="space-y-2.5">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.35rem] font-extrabold text-white tracking-tight leading-[1.18] group-hover:text-violet-300 transition-colors duration-300">
              {project.title}
            </h3>

            <p className="text-sm sm:text-base lg:text-[1rem] text-zinc-300 line-clamp-3 leading-relaxed font-normal">
              {project.fullDescription || project.subtitle}
            </p>

            {/* Tags moved below paragraph with tighter spacing */}
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-violet-950/40 border border-violet-500/30 text-violet-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onProjectClick?.(project);
              }}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25 transition-all hover:scale-105 active:scale-95"
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
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-700/60 transition-all"
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

            {/* Corner Badge */}
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-mono text-emerald-400">
              INTERACTIVE PREVIEW
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectStackCard;
