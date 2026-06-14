'use client';

import React from 'react';

const ActivityHeatmap: React.FC = () => {
  // Generate categories and their 4-week activity data (more compact)
  const categories = [
    { id: 'crafts', label: 'Craft Work', abbr: 'CRF', weight: 1.3 },
    { id: 'critiques', label: 'Critiques', abbr: 'CRQ', weight: 1.0 },
    { id: 'community', label: 'Community', abbr: 'COM', weight: 0.85 },
    { id: 'learning', label: 'Learning', abbr: 'LRN', weight: 0.7 },
  ];

  // Generate 4 weeks of data with realistic contribution patterns
  const generateWeeklyData = (categoryId: string, weight: number): number[] => {
    const weeks: number[] = [];
    const baseActivity = Math.random() * 4 + 1; // Base 1-5 activity level
    
    for (let i = 0; i < 4; i++) {
      // Add some variance between weeks
      const variance = (Math.random() - 0.5) * 2;
      let level = Math.round(baseActivity * weight + variance);
      level = Math.max(0, Math.min(5, level));
      weeks.push(level);
    }
    return weeks;
  };

  const heatmapByCategory = Object.fromEntries(
    categories.map((cat) => [cat.id, generateWeeklyData(cat.id, cat.weight)])
  );

  const getHeatmapColor = (level: number): string => {
    const colors = [
      'oklch(0.88 0.01 45 / 0.5)',      // 0: very light cream
      'oklch(0.75 0.15 45 / 0.55)',     // 1: light orange
      'oklch(0.70 0.18 45 / 0.75)',     // 2: medium orange
      'oklch(0.62 0.22 40 / 0.9)',      // 3: orange
      'oklch(0.58 0.24 38)',            // 4: deep orange
      'oklch(0.52 0.27 35)',            // 5: deep red-orange
    ];
    return colors[level] || colors[0];
  };

  // Calculate stats
  const totalContributions = categories.reduce(
    (sum, cat) => sum + heatmapByCategory[cat.id].reduce((s, v) => s + v, 0),
    0
  );
  
  const maxPossible = categories.length * 4 * 5;
  const activityPercentage = Math.round((totalContributions / maxPossible) * 100);

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Activity Overview</h3>
        <p className="text-xs text-muted-foreground">4-week contribution heatmap across disciplines</p>
      </div>

      {/* Heatmap grid container */}
      <div className="space-y-2.5">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-2.5">
            {/* Category label */}
            <div className="w-10 flex-shrink-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {category.abbr}
              </p>
            </div>

            {/* Weekly cells - compact grid */}
            <div className="flex gap-1.5 flex-1">
              {heatmapByCategory[category.id]?.map((level, weekIdx) => (
                <div
                  key={`${category.id}-${weekIdx}`}
                  className="w-6 h-6 heatmap-cell hover:ring-1 hover:ring-offset-0.5 hover:ring-accent cursor-pointer transition-all"
                  style={{ backgroundColor: getHeatmapColor(level) }}
                  title={`Week ${weekIdx + 1}: Level ${level}`}
                />
              ))}
            </div>

            {/* Week count summary */}
            <div className="text-xs text-muted-foreground text-right w-8 flex-shrink-0">
              {heatmapByCategory[category.id].reduce((s, v) => s + v, 0)}
            </div>
          </div>
        ))}
      </div>

      {/* Legend and stats row */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/20">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Activity:</span>
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className="w-3 h-3 heatmap-cell"
                style={{ backgroundColor: getHeatmapColor(level) }}
                title={`Level ${level}`}
              />
            ))}
          </div>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground">Total points: </span>
          <span className="font-semibold text-foreground">{totalContributions}</span>
          <span className="text-muted-foreground ml-1">({activityPercentage}%)</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
