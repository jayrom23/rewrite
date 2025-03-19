'use client';

import { InputHTMLAttributes, useState, useEffect, useRef } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  showValue?: boolean;
  fullWidth?: boolean;
}

export default function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  showValue = true,
  fullWidth = false,
  className = '',
  ...props
}: SliderProps) {
  const [localValue, setLocalValue] = useState<number>(value);
  const isChanging = useRef(false);
  
  // Update local value when prop changes
  useEffect(() => {
    if (!isChanging.current) {
      setLocalValue(value);
    }
  }, [value]);
  
  // Calculate percentage for styling
  const percentage = ((localValue - min) / (max - min)) * 100;
  
  // Handle change and ensure it's within bounds
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(Math.max(Number(e.target.value), min), max);
    setLocalValue(newValue);
    isChanging.current = true;
  };
  
  // Handle mouseup/blur to finalize value
  const handleFinalize = () => {
    if (isChanging.current) {
      onChange(localValue);
      isChanging.current = false;
    }
  };
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
        {showValue && <span className="text-sm text-gray-500">{localValue}</span>}
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          onMouseUp={handleFinalize}
          onBlur={handleFinalize}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
          {...props}
        />
      </div>
    </div>
  );
}
