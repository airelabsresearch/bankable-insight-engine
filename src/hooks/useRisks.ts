import { useState, useCallback, useMemo } from 'react';
import { Risk, RiskFilters } from '../lib/types/risk';
import { calculateRiskScore, calculateContingency } from '../lib/utils/risk-calculations';

export function useRisks() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [filters, setFilters] = useState<RiskFilters>({});

  const addRisk = useCallback((newRisk: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    const risk: Risk = {
      ...newRisk,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      assessment: {
        ...newRisk.assessment,
        riskScore: calculateRiskScore(newRisk.assessment.likelihood, newRisk.assessment.impactCost),
        contingency: calculateContingency(newRisk.assessment),
      },
    };
    setRisks(prev => [...prev, risk]);
    return risk;
  }, []);

  const updateRisk = useCallback((id: string, updates: Partial<Risk>) => {
    setRisks(prev => prev.map(risk => {
      if (risk.id === id) {
        const updatedRisk = {
          ...risk,
          ...updates,
          updatedAt: new Date(),
          version: risk.version + 1,
        };
        
        // Recalculate risk score and contingency if assessment changed
        if (updates.assessment) {
          updatedRisk.assessment = {
            ...updatedRisk.assessment,
            riskScore: calculateRiskScore(
              updatedRisk.assessment.likelihood,
              updatedRisk.assessment.impactCost
            ),
            contingency: calculateContingency(updatedRisk.assessment),
          };
        }
        
        return updatedRisk;
      }
      return risk;
    }));
  }, []);

  const deleteRisk = useCallback((id: string) => {
    setRisks(prev => prev.filter(risk => risk.id !== id));
  }, []);

  const filteredRisks = useMemo(() => {
    return risks.filter(risk => {
      if (filters.category && risk.category !== filters.category) return false;
      if (filters.stage && risk.stage !== filters.stage) return false;
      if (filters.owner && risk.owner !== filters.owner) return false;
      if (filters.mitigationStatus && risk.mitigation.status !== filters.mitigationStatus) return false;
      if (filters.dateRange) {
        const date = new Date(risk.dateIdentified);
        if (date < filters.dateRange.start || date > filters.dateRange.end) return false;
      }
      return true;
    });
  }, [risks, filters]);

  const getRiskById = useCallback((id: string) => {
    return risks.find(risk => risk.id === id);
  }, [risks]);

  return {
    risks: filteredRisks,
    addRisk,
    updateRisk,
    deleteRisk,
    getRiskById,
    setFilters,
    filters,
  };
} 