import type { StatCardData } from '../types';
import { Target, TrendingUp, FileText, Activity, TrendingDown, Package } from 'lucide-react';

interface StatsCardProps {
  data: StatCardData;
}

const iconMap = {
  target: Target,
  'trending-up': TrendingUp,
  'file-text': FileText,
  activity: Activity,
  package: Package
};

// Generate simple sparkline data
const generateSparklineData = () => {
  const data = [];
  let value = 50 + Math.random() * 20;
  for (let i = 0; i < 20; i++) {
    value += (Math.random() - 0.4) * 10;
    data.push(Math.max(30, Math.min(80, value)));
  }
  return data;
};

export default function StatsCard({ data }: StatsCardProps) {
  const Icon = iconMap[data.icon as keyof typeof iconMap];
  const sparklineData = generateSparklineData();
  const trend = sparklineData[sparklineData.length - 1] > sparklineData[0] ? 'up' : 'down';
  const trendPercent = ((sparklineData[sparklineData.length - 1] - sparklineData[0]) / sparklineData[0] * 100).toFixed(1);
  
  return (
    <div className={`rounded-2xl bg-gradient-to-r ${data.color} p-6 text-white shadow-lg dark:shadow-xl`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-4xl font-bold mb-2">{data.value}</div>
          <div className="text-sm opacity-90">{data.label}</div>
        </div>
        <div className="bg-white/20 rounded-full p-3 dark:bg-white/30">
          {Icon && <Icon size={28} />}
        </div>
      </div>
      
      {/* Mini Sparkline */}
      <div className="mt-4 flex items-end gap-1 h-8">
        {sparklineData.map((value, index) => (
          <div
            key={index}
            className="flex-1 bg-white/30 rounded-t dark:bg-white/40"
            style={{ height: `${(value / 80) * 100}%` }}
          />
        ))}
      </div>
      
      {/* Trend Indicator */}
      <div className="mt-2 flex items-center gap-1 text-xs font-semibold">
        {trend === 'up' ? (
          <>
            <TrendingUp size={14} />
            <span>+{trendPercent}%</span>
          </>
        ) : (
          <>
            <TrendingDown size={14} />
            <span>{trendPercent}%</span>
          </>
        )}
        <span className="opacity-75 ml-1">vs 7 days ago</span>
      </div>
    </div>
  );
}
