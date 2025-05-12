
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Risk, RiskCategory, RiskLikelihood, MitigationStatus, RiskStage } from '@/types/risk';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

interface RiskContextType {
  risks: Risk[];
  addRisk: (risk: Omit<Risk, 'id' | 'riskScore' | 'contingencyAmount' | 'lastUpdated' | 'comments'>) => void;
  updateRisk: (risk: Risk) => void;
  deleteRisk: (id: string) => void;
  calculateRiskScore: (likelihood: RiskLikelihood, impactCost: number) => number;
  calculateContingency: (likelihood: RiskLikelihood, impactCost: number) => number;
}

const RiskContext = createContext<RiskContextType | undefined>(undefined);

const sampleRisk: Risk = {
  id: 'sample-1',
  title: 'Permit Delay',
  category: 'Regulatory',
  stage: 'Pre-Development',
  description: 'Risk of regulatory permits being delayed beyond expected timeline',
  owner: 'Alex Wong',
  dateIdentified: new Date().toISOString(),
  likelihood: 'Medium',
  impactCost: 50000,
  riskScore: 2,
  contingencyAmount: 25000,
  mitigationPlan: 'Engage with regulatory bodies early and prepare all documentation in advance',
  mitigationStatus: 'Not Started',
  residualLikelihood: 'Low',
  residualImpactCost: 15000,
  comments: [],
  lastUpdated: new Date().toISOString(),
  createdBy: 'System'
};

export const RiskProvider = ({ children }: { children: ReactNode }) => {
  const [risks, setRisks] = useState<Risk[]>([sampleRisk]);
  const { toast } = useToast();

  const calculateRiskScore = (likelihood: RiskLikelihood, impactCost: number): number => {
    const likelihoodFactor = likelihood === 'Low' ? 1 : likelihood === 'Medium' ? 2 : 3;
    const impactFactor = impactCost < 10000 ? 1 : impactCost < 50000 ? 2 : 3;
    return likelihoodFactor * impactFactor;
  };

  const calculateContingency = (likelihood: RiskLikelihood, impactCost: number): number => {
    const likelihoodPercentage = likelihood === 'Low' ? 0.25 : likelihood === 'Medium' ? 0.5 : 0.75;
    return Math.round(impactCost * likelihoodPercentage);
  };

  const addRisk = (riskData: Omit<Risk, 'id' | 'riskScore' | 'contingencyAmount' | 'lastUpdated' | 'comments'>) => {
    const riskScore = calculateRiskScore(riskData.likelihood, riskData.impactCost);
    const contingencyAmount = calculateContingency(riskData.likelihood, riskData.impactCost);
    
    const newRisk: Risk = {
      ...riskData,
      id: uuidv4(),
      riskScore,
      contingencyAmount,
      lastUpdated: new Date().toISOString(),
      comments: []
    };
    
    setRisks([...risks, newRisk]);
    toast({
      title: "Risk Added",
      description: `${newRisk.title} has been added to the risk register`,
    });
  };

  const updateRisk = (updatedRisk: Risk) => {
    setRisks(risks.map(risk => risk.id === updatedRisk.id ? {
      ...updatedRisk,
      lastUpdated: new Date().toISOString()
    } : risk));
    
    toast({
      title: "Risk Updated",
      description: `${updatedRisk.title} has been updated`,
    });
  };

  const deleteRisk = (id: string) => {
    const riskToDelete = risks.find(risk => risk.id === id);
    setRisks(risks.filter(risk => risk.id !== id));
    
    toast({
      title: "Risk Deleted",
      description: riskToDelete ? `${riskToDelete.title} has been removed` : "Risk has been removed",
      variant: "destructive"
    });
  };

  return (
    <RiskContext.Provider value={{
      risks,
      addRisk,
      updateRisk,
      deleteRisk,
      calculateRiskScore,
      calculateContingency
    }}>
      {children}
    </RiskContext.Provider>
  );
};

export const useRisk = () => {
  const context = useContext(RiskContext);
  if (context === undefined) {
    throw new Error('useRisk must be used within a RiskProvider');
  }
  return context;
};
