export type RiskCategory = 
  | 'Technical'
  | 'Financial'
  | 'Regulatory'
  | 'Environmental'
  | 'Social'
  | 'Operational'
  | string; // Allow custom categories

export type ProjectStage = 
  | 'Feasibility'
  | 'Pre-Financing'
  | 'Development'
  | 'Construction'
  | 'Operations';

export type RiskLikelihood = 'Low' | 'Medium' | 'High' | number; // Allow percentage as number

export type MitigationStatus = 'Not Started' | 'In Progress' | 'Done';

export interface RiskAssessment {
  likelihood: RiskLikelihood;
  impactCost: number;
  riskScore: number;
  contingency: number;
}

export interface MitigationPlan {
  description: string;
  status: MitigationStatus;
  residualLikelihood: RiskLikelihood;
  residualImpactCost: number;
  owner: string;
  dueDate?: Date;
}

export interface RiskComment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Risk {
  id: string;
  title: string;
  category: RiskCategory;
  stage: ProjectStage;
  description: string;
  owner: string;
  dateIdentified: Date;
  assessment: RiskAssessment;
  mitigation: MitigationPlan;
  comments: RiskComment[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface RiskFilters {
  category?: RiskCategory;
  stage?: ProjectStage;
  owner?: string;
  mitigationStatus?: MitigationStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface RiskExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeComments: boolean;
  includeVersionHistory: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
} 