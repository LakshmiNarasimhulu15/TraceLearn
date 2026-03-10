export const getPanelClass = (darkMode) =>
  darkMode
    ? "bg-gray-900/70 border border-white/10 text-white"
    : "bg-white/80 border border-slate-200 text-slate-900";

export const getSubtlePanelClass = (darkMode) =>
  darkMode
    ? "bg-slate-800/80 border border-white/10 text-white"
    : "bg-slate-50 border border-slate-200 text-slate-900";

export const getPageClass = (darkMode) =>
  darkMode
    ? "page-gradient-dark text-white"
    : "page-gradient-light text-slate-900";