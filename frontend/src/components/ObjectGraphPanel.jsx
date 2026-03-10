import React, { useContext, useMemo } from "react";
import { Package } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const ObjectGraphPanel = ({ objectGraph }) => {
  const { darkMode } = useContext(ThemeContext);

  const nodes = objectGraph?.nodes || [];

  return (
    <div
      className={`rounded-3xl border p-4 ${darkMode ? "bg-slate-950/60 border-white/10 text-white" : "bg-white/75 border-slate-200 text-slate-900"}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Package size={18} />
        <span className="font-frozito text-[20px]">Objects</span>
      </div>

      {!nodes.length ? (
        <div className="font-jetbrains text-xs opacity-70">
          No objects in this step.
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-jetbrains text-sm font-semibold">Objects ({nodes.length})</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {nodes.slice(0, 10).map((node) => (
              <div
                key={node.id}
                className={`rounded-xl font-jetbrains p-2 border text-xs ${darkMode ? "bg-slate-900/70 border-white/10" : "bg-slate-50 border-slate-200"}`}
              >
                <div className="font-semibold truncate">{node.id}</div>
                <div className="opacity-80">{node.type}</div>
                {node.attributes && Object.keys(node.attributes).length > 0 && (
                  <div className="mt-1 opacity-70">
                    {Object.keys(node.attributes).length} attrs
                  </div>
                )}
              </div>
            ))}
            {nodes.length > 10 && (
              <div className="col-span-2 text-center opacity-70 text-xs">
                +{nodes.length - 10} more objects
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectGraphPanel;