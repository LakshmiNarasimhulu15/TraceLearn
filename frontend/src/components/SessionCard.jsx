import React, { useContext } from "react";
import { CalendarDays, ChevronRight, FileCode2, Hash } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const SessionCard = ({ session, onOpen }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={() => onOpen(session.id)}
      className={`w-full text-left rounded-3xl p-4 border transition-all shadow-sm hover:-translate-y-0.5 ${
        darkMode
          ? "bg-slate-900/70 border-white/10 hover:bg-slate-800/80 text-white"
          : "bg-white/85 border-slate-200 hover:bg-white text-slate-900"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <FileCode2 size={18} />
            <span className="font-frozito text-xl">Saved Session</span>
          </div>

          <div className="font-jetbrains text-xs opacity-75 flex items-center gap-2 mb-3">
            <Hash size={13} />
            Session ID: {session.id}
          </div>

          <div className="font-jetbrains text-xs opacity-75 flex items-center gap-2 mb-3">
            <CalendarDays size={13} />
            {new Date(session.created_at).toLocaleString()}
          </div>

          <pre
            className={`font-jetbrains text-xs whitespace-pre-wrap line-clamp-5 rounded-2xl p-3 ${
              darkMode ? "bg-white/5" : "bg-slate-50"
            }`}
          >
            {session.code}
          </pre>
        </div>

        <div className="shrink-0 opacity-70">
          <ChevronRight size={18} />
        </div>
      </div>
    </button>
  );
};

export default SessionCard;