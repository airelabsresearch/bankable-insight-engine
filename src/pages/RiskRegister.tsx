
import React, { useState } from 'react';
import { useRisk, RiskProvider } from '@/context/RiskContext';
import { RiskTable } from '@/components/risk-register/RiskTable';
import { RiskCreationWizard } from '@/components/risk-register/RiskCreationWizard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Download, Plus, BarChart3 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

const RiskRegisterContent: React.FC = () => {
  const { risks } = useRisk();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  const totalRisks = risks.length;
  const highRisks = risks.filter(risk => risk.riskScore >= 6).length;
  const mitigatedRisks = risks.filter(risk => risk.mitigationStatus === 'Done').length;
  const totalContingency = risks.reduce((acc, risk) => acc + risk.contingencyAmount, 0);
  
  const handleExportRiskRegister = () => {
    // Create CSV content
    const headers = [
      'Title', 'Category', 'Stage', 'Owner', 'Date Identified', 
      'Likelihood', 'Impact Cost ($)', 'Risk Score', 'Contingency ($)',
      'Mitigation Plan', 'Mitigation Status'
    ].join(',');
    
    const csvRows = risks.map(risk => [
      `"${risk.title}"`,
      `"${risk.category}"`,
      `"${risk.stage}"`,
      `"${risk.owner}"`,
      `"${new Date(risk.dateIdentified).toLocaleDateString()}"`,
      `"${risk.likelihood}"`,
      risk.impactCost,
      risk.riskScore,
      risk.contingencyAmount,
      `"${risk.mitigationPlan}"`,
      `"${risk.mitigationStatus}"`
    ].join(','));
    
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `risk-register-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Risk Register</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track, assess, and mitigate risks throughout your project lifecycle.
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleExportRiskRegister}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsWizardOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Risk
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRisks}</div>
            <p className="text-xs text-muted-foreground">
              {totalRisks === 0 ? 'No risks identified' : `${highRisks} high priority`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRisks}</div>
            <p className="text-xs text-muted-foreground">
              {highRisks === 0 ? 'No high risks' : `${((highRisks / totalRisks) * 100).toFixed(0)}% of total risks`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mitigated Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mitigatedRisks}</div>
            <p className="text-xs text-muted-foreground">
              {totalRisks === 0 ? 'No risks identified' : `${((mitigatedRisks / totalRisks) * 100).toFixed(0)}% completion`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contingency</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(totalContingency)}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated buffer needed
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Risk Items</h2>
        </div>
        <Link to="/risk" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <BarChart3 className="h-4 w-4" />
          Risk Analysis
        </Link>
      </div>
      
      <Separator />
      
      <RiskTable />
      
      <RiskCreationWizard 
        open={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  );
};

const RiskRegister: React.FC = () => {
  return (
    <RiskProvider>
      <RiskRegisterContent />
    </RiskProvider>
  );
};

export default RiskRegister;
