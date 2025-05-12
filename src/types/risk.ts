
export type RiskLikelihood = "Low" | "Medium" | "High";
export type RiskStage = "Pre-Development" | "Development" | "Construction" | "Operation";
export type RiskCategory = 
  | "Technical" 
  | "Environmental" 
  | "Regulatory" 
  | "Financial" 
  | "Social" 
  | "Commercial" 
  | "Legal" 
  | "Operational";
export type MitigationStatus = "Not Started" | "In Progress" | "Done";

export interface Risk {
  id: string;
  title: string;
  category: RiskCategory;
  stage: RiskStage;
  description: string;
  owner: string;
  dateIdentified: string;
  likelihood: RiskLikelihood;
  impactCost: number;
  riskScore: number;
  contingencyAmount: number;
  mitigationPlan: string;
  mitigationStatus: MitigationStatus;
  residualLikelihood: RiskLikelihood;
  residualImpactCost: number;
  comments: string[];
  lastUpdated: string;
  createdBy: string;
}
