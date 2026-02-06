'use client';

import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceRadarProps {
  data: Record<string, number>;
}

export function PerformanceRadar({ data }: PerformanceRadarProps) {
  const chartData = Object.entries(data).map(([subject, accuracy]) => ({
    subject,
    accuracy: Math.round(accuracy),
  }));

  if (chartData.length < 3) {
    return (
      <Card className="glassmorphism bg-background/40 border-white/5">
        <CardHeader>
          <CardTitle className="text-lg text-white">
            Performance Radar
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center px-10 text-center text-sm text-gray-500">
          Complete tests in at least 3 different subjects to generate your
          Performance Radar.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism bg-background/40 border-white/5">
      <CardHeader>
        <CardTitle className="text-lg text-white">Performance Radar</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#4b5563', fontSize: 10 }}
            />
            <Radar
              name="Accuracy"
              dataKey="accuracy"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
