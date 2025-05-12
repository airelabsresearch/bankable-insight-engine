import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRisks } from '@/hooks/useRisks';
import type { Risk, MitigationStatus } from '@/lib/types/risk';

const statusColumns: { status: MitigationStatus; title: string }[] = [
  { status: 'Not Started', title: 'Not Started' },
  { status: 'In Progress', title: 'In Progress' },
  { status: 'Done', title: 'Completed' },
];

export const RiskKanban: React.FC = () => {
  const { risks } = useRisks();

  const risksByStatus = statusColumns.reduce((acc, { status }) => {
    acc[status] = risks.filter(risk => risk.mitigation?.status === status);
    return acc;
  }, {} as Record<MitigationStatus, Risk[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statusColumns.map(({ status, title }) => (
        <Card key={status} className="flex flex-col">
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 px-2 py-2">
            <div className="space-y-2">
              {risksByStatus[status].map(risk => (
                <div
                  key={risk.id}
                  className="p-3 rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <h4 className="font-medium">{risk.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {risk.description.substring(0, 100)}
                    {risk.description.length > 100 ? '...' : ''}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{risk.owner}</span>
                    <span>${risk.assessment.impactCost.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 