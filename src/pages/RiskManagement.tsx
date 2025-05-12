import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRisks } from '@/hooks/useRisks';
import { Risk } from '@/lib/types/risk';
import { formatCurrency, calculateTotalContingency } from '@/lib/utils/risk-calculations';

// We'll create these components next
import { RiskTable } from '@/components/risks/RiskTable';
import { RiskKanban } from '@/components/risks/RiskKanban';
import { RiskForm } from '@/components/risks/RiskForm';
import { RiskFilters } from '@/components/risks/RiskFilters';
import { RiskDashboard } from '@/components/risks/RiskDashboard';

export function RiskManagement() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddingRisk, setIsAddingRisk] = useState(false);
  const { risks, addRisk, updateRisk, deleteRisk, setFilters } = useRisks();

  const handleAddRisk = (risk: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    addRisk(risk);
    setIsAddingRisk(false);
  };

  const totalContingency = calculateTotalContingency(risks.map(r => r.assessment));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Risk Management</h1>
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Contingency</p>
            <p className="text-2xl font-bold">{formatCurrency(totalContingency)}</p>
          </div>
          <Button onClick={() => setIsAddingRisk(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Risk
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="kanban">Kanban View</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <RiskDashboard risks={risks} />
            </TabsContent>

            <TabsContent value="table" className="mt-6">
              <div className="space-y-4">
                <RiskFilters onFilterChange={setFilters} />
                <RiskTable 
                  risks={risks}
                  onUpdate={updateRisk}
                  onDelete={deleteRisk}
                />
              </div>
            </TabsContent>

            <TabsContent value="kanban" className="mt-6">
              <RiskKanban 
                risks={risks}
                onUpdate={updateRisk}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isAddingRisk && (
        <RiskForm
          onSubmit={handleAddRisk}
          onCancel={() => setIsAddingRisk(false)}
        />
      )}
    </div>
  );
} 