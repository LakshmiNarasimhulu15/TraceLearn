import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FolderCode, RefreshCw } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { getPageClass } from "../utils/theme";
import useFetchSessions from "../hooks/useFetchSessions";
import SessionCard from "../components/SessionCard";

const MyCodesPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { sessions, loading, error, reloadSessions } = useFetchSessions();
  const navigate = useNavigate();

  const handleOpenSession = (sessionId) => {
    navigate(`/?sessionId=${sessionId}`);
  };

  return (
    <div className={`h-full w-full overflow-hidden ${getPageClass(darkMode)}`}>
      <div className="h-full panel-scroll p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div
            className={`rounded-3xl border p-5 md:p-6 mb-6 ${
              darkMode
                ? "bg-slate-950/60 border-white/10 text-white"
                : "bg-white/75 border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FolderCode size={22} />
                  <h1 className="font-frozito text-4xl">My Code Sessions</h1>
                </div>
                <p className="font-jetbrains text-sm opacity-75">
                  Reopen saved code, inspect older traces, and continue learning.
                </p>
              </div>

              <button
                onClick={reloadSessions}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-jetbrains border transition-all ${
                  darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div
              className={`rounded-3xl border p-8 text-center font-jetbrains ${
                darkMode
                  ? "bg-slate-950/60 border-white/10 text-white"
                  : "bg-white/75 border-slate-200 text-slate-900"
              }`}
            >
              Loading sessions...
            </div>
          ) : error ? (
            <div
              className={`rounded-3xl border p-8 text-center font-jetbrains ${
                darkMode
                  ? "bg-red-500/10 border-red-400/20 text-white"
                  : "bg-red-50 border-red-200 text-slate-900"
              }`}
            >
              Error fetching sessions.
            </div>
          ) : sessions.length === 0 ? (
            <div
              className={`rounded-3xl border p-8 text-center font-jetbrains ${
                darkMode
                  ? "bg-slate-950/60 border-white/10 text-white"
                  : "bg-white/75 border-slate-200 text-slate-900"
              }`}
            >
              No past sessions found.
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onOpen={handleOpenSession}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCodesPage;