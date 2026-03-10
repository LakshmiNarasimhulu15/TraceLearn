import React, { useContext } from "react";
import { Keyboard } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const InputPanel = ({ inputs, setInputs }) => {
  const { darkMode } = useContext(ThemeContext);

  const handleChange = (index, value) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
  };

  const handleAddInput = () => {
    setInputs([...(inputs || []), ""]);
  };

  const handleRemoveInput = (index) => {
    const updated = [...inputs];
    updated.splice(index, 1);
    setInputs(updated);
  };

  return (
    <div
      className={`rounded-3xl border p-4 ${
        darkMode
          ? "bg-slate-950/60 border-white/10 text-white"
          : "bg-white/75 border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Keyboard size={18} />
        <span className="font-frozito text-[20px]">Runtime Inputs</span>
      </div>

      <div className="space-y-3">
        {(inputs || []).map((inputValue, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`Input ${index + 1}`}
              className={`flex-1 rounded-2xl px-3 py-2 text-sm font-jetbrains outline-none border ${
                darkMode
                  ? "bg-slate-900 border-white/10 text-white placeholder:text-slate-400"
                  : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
              }`}
            />
            <button
              onClick={() => handleRemoveInput(index)}
              className={`rounded-2xl px-3 py-2 text-sm font-jetbrains border ${
                darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={handleAddInput}
          className={`w-full rounded-2xl px-3 py-2 text-sm font-jetbrains border ${
            darkMode
              ? "bg-cyan-500/10 border-cyan-400/20 hover:bg-cyan-500/20"
              : "bg-cyan-50 border-cyan-200 hover:bg-cyan-100"
          }`}
        >
          Add Input
        </button>
      </div>
    </div>
  );
};

export default InputPanel;