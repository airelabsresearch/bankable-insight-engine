import type { RiskAssessment } from '@/lib/types/risk';

const LIKELIHOOD_VALUES = {
  'Low': 0.3,
  'Medium': 0.5,
  'High': 0.7,
};

export const calculateRiskScore = (likelihood: number, impactCost: number): number => {
  return likelihood * impactCost;
};

export const calculateContingency = (assessment: RiskAssessment): number => {
  return assessment.riskScore;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getLikelihoodLabel = (likelihood: number): string => {
  if (likelihood <= 0.3) return 'Low';
  if (likelihood <= 0.7) return 'Medium';
  return 'High';
};

export const getRiskLevel = (riskScore: number): 'Low' | 'Medium' | 'High' => {
  if (riskScore <= 100000) return 'Low';
  if (riskScore <= 500000) return 'Medium';
  return 'High';
};

export const calculateTotalContingency = (assessments: RiskAssessment[]): number => {
  return assessments.reduce((total, assessment) => total + assessment.contingency, 0);
};

export const calculateRiskDistribution = (assessments: RiskAssessment[]): { low: number; medium: number; high: number } => {
  return assessments.reduce(
    (acc, assessment) => {
      const level = getRiskLevel(assessment.riskScore);
      acc[level.toLowerCase() as keyof typeof acc]++;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );
}; 