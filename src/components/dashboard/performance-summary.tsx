'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StrengthWeaknessMetric } from '@/lib/types';
import { TrendingUp, TrendingDown, Target, Brain } from 'lucide-react';

interface PerformanceSummaryProps {
  strengths: StrengthWeaknessMetric[];
  weaknesses: StrengthWeaknessMetric[];
}

export function PerformanceSummary({
  strengths,
  weaknesses,
}: PerformanceSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="glassmorphism border-green-500/20 bg-green-500/5">
        <CardHeader className="flex flex-row items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-400" />
          <CardTitle className="text-lg text-white">Top Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strengths.length > 0 ? (
              strengths.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-green-500/20 p-2">
                      <Target className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase">
                        {s.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-400">
                    {Math.round(s.accuracy)}%
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Keep practicing to identify your strengths.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="glassmorphism border-orange-500/20 bg-orange-500/5">
        <CardHeader className="flex flex-row items-center space-x-2">
          <TrendingDown className="h-5 w-5 text-orange-400" />
          <CardTitle className="text-lg text-white">Areas to Improve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weaknesses.length > 0 ? (
              weaknesses.map((w, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-orange-500/20 p-2">
                      <Brain className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {w.name}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase">
                        {w.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-orange-400">
                    {Math.round(w.accuracy)}%
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Keep practicing to identify areas for improvement.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
