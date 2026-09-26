import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2.5 focus:bg-[#2EC4B6] focus:text-white focus:font-bold focus:rounded-xl focus:shadow-2xl focus:ring-4 focus:ring-[#2EC4B6]/40 focus:outline-none text-sm transition"
    >
      Skip to Main Educational Content (Press Enter)
    </a>
  );
};
