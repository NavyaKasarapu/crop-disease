import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatisticsCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  trend?: string;
  badge?: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  badge = 'PlantVillage Benchmark'
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
          {label}
        </span>
        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-extrabold text-stone-900 tracking-tight font-display tabular-nums">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
        <span>{subtext}</span>
        <span className="text-[10px] text-stone-400 font-mono" title="Connect backend telemetry to update dynamically">
          {badge}
        </span>
      </div>
    </div>
  );
};
