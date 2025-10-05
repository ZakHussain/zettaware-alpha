import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onConfirm: (color: string) => void;
  onClose: () => void;
  label: string;
}

interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export function ColorPicker({ color, onChange, onConfirm, onClose, label }: ColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hsv, setHsv] = useState<HSV>(hexToHsv(color));
  const [isDragging, setIsDragging] = useState(false);
  const [hexInput, setHexInput] = useState(color);

  useEffect(() => {
    drawColorWheel();
  }, []);

  useEffect(() => {
    // Update hex input when HSV changes internally
    const newHex = hsvToHex(hsv);
    setHexInput(newHex);
    onChange(newHex);
  }, [hsv]);

  useEffect(() => {
    // Synchronize internal state with external color prop only when the prop changes
    // and is different from the current internal hex input.
    // This prevents infinite loops and ensures external changes are reflected.
    if (color !== hexInput && isValidHex(color)) {
      setHsv(hexToHsv(color));
      setHexInput(color); // Ensure hexInput is also updated from prop
    }
  }, [color]); // Only react to changes in the external color prop

  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 0.5) {
      const startAngle = (angle - 2) * Math.PI / 180;
      const endAngle = angle * Math.PI / 180;

      for (let r = 0; r < radius; r += 1) {
        const saturation = r / radius * 100;
        const hue = angle;
        const value = 100;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, startAngle, endAngle);
        ctx.strokeStyle = `hsl(${hue}, ${saturation}%, 50%)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const hue = (angle + 360) % 360;
      const saturation = (distance / radius) * 100;

      const newHsv = { ...hsv, h: hue, s: saturation };
      setHsv(newHsv);
    }
  };

  const handleHexInputChange = (value: string) => {
    setHexInput(value);
    if (isValidHex(value)) {
      const newHsv = hexToHsv(value);
      setHsv(newHsv);
    }
  };

  const handleApply = () => {
    onConfirm(hsvToHex(hsv));
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Color Wheel */}
        <div className="mb-4">
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            className="border border-gray-200 rounded-lg cursor-crosshair mx-auto block"
            onClick={handleCanvasClick}
          />
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Value Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brightness</label>
            <input
              type="range"
              min="0"
              max="100"
              value={hsv.v}
              onChange={(e) => setHsv(prev => ({ ...prev, v: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #000000, ${hsvToHex({ ...hsv, v: 100 })})`
              }}
            />
          </div>

          {/* Color Preview and Hex Input */}
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-lg border-2 border-gray-200 flex-shrink-0"
              style={{ backgroundColor: hsvToHex(hsv) }}
            />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hex Color</label>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexInputChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* HSV Values */}
          <div className="grid grid-cols-3 gap-3 text-xs text-gray-600">
            <div className="text-center">
              <div>H: {Math.round(hsv.h)}°</div>
            </div>
            <div className="text-center">
              <div>S: {Math.round(hsv.s)}%</div>
            </div>
            <div className="text-center">
              <div>V: {Math.round(hsv.v)}%</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function hexToHsv(hex: string): HSV {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    if (max === r) {
      h = 60 * ((g - b) / diff);
    } else if (max === g) {
      h = 60 * ((b - r) / diff) + 120;
    } else {
      h = 60 * ((r - g) / diff) + 240;
    }
  }
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : (diff / max) * 100;
  const v = max * 100;

  return { h, s, v };
}

function hsvToHex(hsv: HSV): string {
  const { h, s, v } = hsv;
  const c = (v / 100) * (s / 100);
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = (v / 100) - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function isValidHex(hex: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(hex);
}