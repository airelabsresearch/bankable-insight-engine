import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRisks } from '@/hooks/useRisks';
import { calculateTotalContingency, calculateRiskDistribution } from '@/lib/utils/risk-calculations';
import type { Risk } from '@/lib/types/risk';

export const RiskDashboard: React.FC = () => {
  const { risks } = useRisks();
  const assessments = risks.map(r => r.assessment);
  const totalContingency = calculateTotalContingency(assessments);
  const riskDistribution = calculateRiskDistribution(assessments);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{risks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contingency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalContingency.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskDistribution.high}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mitigation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((risks.filter(r => r.mitigation?.status === 'Done').length / risks.length) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 