import React, { useState, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

interface PatternLockProps {
  value?: number[];
  onChange?: (pattern: number[]) => void;
  readOnly?: boolean;
  size?: number;
}

export const PatternLock: React.FC<PatternLockProps> = ({
  value = [],
  onChange,
  readOnly = false,
  size = 180,
}) => {
  const [selected, setSelected] = useState<number[]>(value);
  const [isDrawing, setIsDrawing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if value prop changes
  React.useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleNodeClick = (index: number) => {
    if (readOnly) return;
    if (selected.includes(index)) {
      // Toggle or keep
      return;
    }
    const newSeq = [...selected, index];
    setSelected(newSeq);
    onChange?.(newSeq);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected([]);
    onChange?.([]);
  };

  // Node positions on 3x3 grid (normalized 0 to 100%)
  const getNodePos = (idx: number) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const step = 100 / 3;
    return {
      x: col * step + step / 2,
      y: row * step + step / 2,
    };
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        style={{ width: size, height: size }}
        className="relative bg-slate-900 rounded-xl p-3 border border-slate-700 select-none shadow-inner"
      >
        {/* SVG connection lines between selected nodes */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
        >
          {selected.length > 1 && (
            <polyline
              points={selected.map((node) => {
                const pos = getNodePos(node);
                return `${pos.x},${pos.y}`;
              }).join(' ')}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={readOnly ? 'none' : 'none'}
            />
          )}
        </svg>

        {/* 3x3 Node Grid */}
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-2">
          {Array.from({ length: 9 }).map((_, idx) => {
            const isSelected = selected.includes(idx);
            const orderIndex = selected.indexOf(idx);

            return (
              <button
                key={idx}
                type="button"
                disabled={readOnly}
                onClick={() => handleNodeClick(idx)}
                className={`relative flex items-center justify-center rounded-full transition-all focus:outline-none ${
                  readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-105'
                }`}
                title={`Ponto ${idx + 1}`}
              >
                {/* Outer ring */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-sky-500/20 ring-2 ring-sky-400'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                >
                  {/* Center dot */}
                  <div
                    className={`w-3 h-3 rounded-full transition-transform ${
                      isSelected ? 'bg-sky-400 scale-125' : 'bg-slate-500'
                    }`}
                  />
                </div>

                {/* Sequence badge */}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center">
                    {orderIndex + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Control bar */}
      {!readOnly && (
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-rose-600 px-2 py-1 rounded bg-slate-100 hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar Padrão</span>
          </button>
          <span className="text-xs text-slate-600">
            {selected.length > 0 ? `${selected.length} pontos ligados` : 'Clique nos pontos na ordem'}
          </span>
        </div>
      )}
    </div>
  );
};
