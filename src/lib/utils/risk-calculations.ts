import { RiskLikelihood, RiskAssessment } from '../types/risk';

const LIKELIHOOD_VALUES = {
  'Low': 0.3,
  'Medium': 0.5,
  'High': 0.7,
};

export function calculateRiskScore(likelihood: RiskLikelihood, impactCost: number): number {
  const likelihoodValue = typeof likelihood === 'number' 
    ? likelihood / 100 
    : LIKELIHOOD_VALUES[likelihood as keyof typeof LIKELIHOOD_VALUES];
  
  return likelihoodValue * impactCost;
}

export function calculateContingency(assessment: RiskAssessment): number {
  return assessment.riskScore;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getLikelihoodLabel(likelihood: RiskLikelihood): string {
  if (typeof likelihood === 'number') {
    return `${likelihood}%`;
  }
  return likelihood;
}

export function getRiskLevel(riskScore: number): 'Low' | 'Medium' | 'High' {
  if (riskScore < 100000) return 'Low';
  if (riskScore < 500000) return 'Medium';
  return 'High';
}

export function calculateTotalContingency(assessments: RiskAssessment[]): number {
  return assessments.reduce((total, assessment) => total + assessment.contingency, 0);
}

export function calculateRiskDistribution(risks: { assessment: RiskAssessment }[]): {
  low: number;
  medium: number;
  high: number;
} {
  return risks.reduce(
    (acc, risk) => {
      const level = getRiskLevel(risk.assessment.riskScore);
      acc[level.toLowerCase() as keyof typeof acc]++;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );
} 