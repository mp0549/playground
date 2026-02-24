import React from 'react';

export default function GameCard({ title, subtitle, href, image, children, moduleId, onAccess }) {
  const handleClick = (e) => {
    try {
      if (onAccess) onAccess();
    } catch (err) {
      // ignore
    }
    // allow navigation to proceed
  };

  return (
    <article className="group card exp-card bg-white border border-black overflow-hidden relative transform transition-all duration-300 hover:translate-y-[-1px]">
      <div className="absolute top-2 left-2 text-xxs text-gray-600 uppercase tracking-wide z-10">{moduleId}</div>
      <div className="absolute top-2 right-2 w-2 h-2 bg-gray-400 rounded-full transition-colors duration-300 group-hover:bg-black"></div>

      {/* inner glow */}
      <div className="inner-glow pointer-events-none" aria-hidden />

      {/* animated outline SVG for trace effect */}
      <svg className="trace-svg absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <rect x="0.5" y="0.5" width="100%" height="100%" fill="none" stroke="black" strokeWidth="1" className="trace-rect" />
      </svg>

      <div className="card-body p-4">
        <div className="relative mb-4">
          <div className="thumbnail-placeholder bg-gray-100 h-32 flex items-center justify-center border border-black">
            {image ? (
              <img src={image} alt={title} className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <span className="text-black text-sm uppercase tracking-wide">{title}</span>
            )}
          </div>
        </div>

        <hr className="border-black mb-4" />
        <h3 className="card-title text-sm uppercase tracking-wide mb-2">{title}</h3>
        {subtitle && <p className="text-xs text-gray-600 uppercase tracking-wide">{subtitle}</p>}
        {children && children !== subtitle && <p className="text-xs mt-2 text-gray-700">{children}</p>}

        <div className="card-actions mt-4 flex items-center">
          <a onClick={handleClick} className="btn btn-xs bg-white text-black border border-black uppercase tracking-wide hover:bg-gray-100 rounded-none px-3 py-1 exp-access" href={href}>
            <span className="exp-tooltip">INITIALIZING…</span>
            [ ACCESS ]
          </a>
        </div>
      </div>
    </article>
  );
}
  