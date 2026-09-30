import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';

interface PlaceholderViewProps {
  title: string;
  subtitle: string;
  badgeText: string;
  children?: React.ReactNode;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  title,
  subtitle,
  badgeText,
  children,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100">{title}</h1>
            <Badge variant="default" className="font-mono text-[10px]">
              {badgeText}
            </Badge>
          </div>
          <p className="text-sm text-neutral-400">{subtitle}</p>
        </div>
      </div>

      {children ? (
        children
      ) : (
        <Card className="border-dashed border-neutral-800 bg-neutral-900/30 text-center py-16">
          <CardHeader>
            <CardTitle className="text-neutral-200">Layer In Progress</CardTitle>
            <CardDescription className="max-w-md mx-auto text-neutral-400">
              This module will be connected to the deterministic financial engine in the upcoming layers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20">
              <span>Status: Architecture Ready</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
