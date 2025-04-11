
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Download, Save, SlidersHorizontal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';

type SensitivityAnalysisDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Mock data for scenarios
const mockScenarios = [
  { id: 'green-hydrogen', name: 'Green Hydrogen Plant' },
  { id: 'solar', name: 'Solar + Storage' },
  { id: 'efuel', name: 'E-Fuel Production' },
];

// Mock data for input variables
const mockInputVariables = [
  { id: 'capex', name: 'CAPEX', baselineValue: '$120M' },
  { id: 'opex', name: 'OPEX', baselineValue: '$8.2M/year' },
  { id: 'efficiency', name: 'Electrolyzer Efficiency', baselineValue: '67%' },
  { id: 'capacity', name: 'Capacity Factor', baselineValue: '85%' },
  { id: 'debt-ratio', name: 'Debt Ratio', baselineValue: '60%' },
  { id: 'interest', name: 'Interest Rate', baselineValue: '4.5%' },
  { id: 'electricity', name: 'Electricity Price', baselineValue: '$45/MWh' },
  { id: 'h2-price', name: 'Hydrogen Price', baselineValue: '$4.50/kg' },
  { id: 'tax-credits', name: 'Tax Credits', baselineValue: '$3/kg' },
  { id: 'stack-replacement', name: 'Stack Replacement', baselineValue: '8 years' },
  { id: 'carbon-credits', name: 'Carbon Credits', baselineValue: '$85/ton' },
];

// Output metrics
const outputMetrics = [
  { id: 'irr', name: 'IRR (%)' },
  { id: 'npv', name: 'NPV ($)' },
  { id: 'payback', name: 'Payback Period (years)' },
  { id: 'lcoh', name: 'LCOH ($/kg)' },
];

const SensitivityAnalysisDialog: React.FC<SensitivityAnalysisDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [selectedMetric, setSelectedMetric] = useState<string>('irr');
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSelectVariable = (variableId: string, checked: boolean) => {
    if (checked) {
      if (selectedVariables.length < 10) {
        setSelectedVariables([...selectedVariables, variableId]);
      }
    } else {
      setSelectedVariables(selectedVariables.filter(id => id !== variableId));
    }
  };

  const handleRunAnalysis = () => {
    if (selectedVariables.length === 0) return;
    
    setLoading(true);
    
    // Simulate analysis with delay
    setTimeout(() => {
      // Generate mock results - in a real app this would be calculated
      const mockResults = selectedVariables.map(varId => {
        const variable = mockInputVariables.find(v => v.id === varId);
        // Generate a random impact value between 5 and 85
        const impactValue = Math.round((Math.random() * 80 + 5) * 10) / 10;
        // Decide if positive or negative impact based on variable type
        const isNegative = ['capex', 'opex', 'interest', 'stack-replacement'].includes(varId);
        const impact = isNegative ? -impactValue : impactValue;
        
        // Create data for positive and negative variations
        const baselineValue = selectedMetric === 'irr' ? 15.2 : 
          selectedMetric === 'npv' ? 48.2 : 
          selectedMetric === 'payback' ? 7.1 : 3.5;
          
        const positiveChange = impact / 100 * baselineValue;
        const negativeChange = -impact / 100 * baselineValue;
        
        return {
          variable: variable?.name || varId,
          impact,
          positiveValue: +(baselineValue + positiveChange).toFixed(1),
          negativeValue: +(baselineValue + negativeChange).toFixed(1),
          baselineValue,
        };
      });
      
      // Sort by absolute impact value (highest to lowest)
      const sortedResults = mockResults.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
      
      setResults(sortedResults);
      setLoading(false);
      setAnalysisComplete(true);
      setStep(4); // Move to results step
    }, 1500);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedScenario('');
    setSelectedMetric('irr');
    setSelectedVariables([]);
    setAnalysisComplete(false);
    setResults([]);
  };

  const handleAdjustInputs = () => {
    setStep(2);
    setAnalysisComplete(false);
  };
  
  const formatValue = (value: number, metric: string) => {
    switch (metric) {
      case 'irr':
        return `${value}%`;
      case 'npv':
        return `$${value}M`;
      case 'payback':
        return `${value} years`;
      case 'lcoh':
        return `$${value}/kg`;
      default:
        return value.toString();
    }
  };

  const getChartData = () => {
    return results.map(result => ({
      name: result.variable,
      negative: result.impact < 0 ? Math.abs(result.impact) : 0,
      positive: result.impact > 0 ? result.impact : 0,
      positiveValue: result.positiveValue,
      negativeValue: result.negativeValue,
      baselineValue: result.baselineValue,
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="scenario-select">Select a Scenario</Label>
              <Select
                value={selectedScenario}
                onValueChange={(value) => setSelectedScenario(value)}
              >
                <SelectTrigger id="scenario-select" className="w-full mt-1">
                  <SelectValue placeholder="Choose a scenario" />
                </SelectTrigger>
                <SelectContent>
                  {mockScenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => setStep(2)}
                disabled={!selectedScenario}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="metric-select">Select Output Metric</Label>
              <Select
                value={selectedMetric}
                onValueChange={(value) => setSelectedMetric(value)}
              >
                <SelectTrigger id="metric-select" className="w-full mt-1">
                  <SelectValue placeholder="Choose an output metric" />
                </SelectTrigger>
                <SelectContent>
                  {outputMetrics.map((metric) => (
                    <SelectItem key={metric.id} value={metric.id}>
                      {metric.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">
                Select Input Variables (max 10)
                <span className="ml-2 text-sm text-muted-foreground">
                  {selectedVariables.length}/10 selected
                </span>
              </Label>
              <div className="max-h-64 overflow-y-auto border rounded-md p-3 space-y-3">
                {mockInputVariables.map((variable) => (
                  <div key={variable.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={variable.id} 
                      checked={selectedVariables.includes(variable.id)}
                      onCheckedChange={(checked) => handleSelectVariable(variable.id, checked === true)}
                      disabled={!selectedVariables.includes(variable.id) && selectedVariables.length >= 10}
                    />
                    <Label htmlFor={variable.id} className="flex-1 cursor-pointer flex justify-between">
                      <span>{variable.name}</span>
                      <span className="text-sm text-muted-foreground">{variable.baselineValue}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button 
                onClick={handleRunAnalysis}
                disabled={selectedVariables.length === 0 || loading}
                className="eco-gradient"
              >
                {loading ? "Running..." : "Run Sensitivity Analysis"}
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">Sensitivity to {outputMetrics.find(m => m.id === selectedMetric)?.name}</p>
              <p className="text-xs text-muted-foreground">
                Showing impact of ±10% change in each parameter on 
                {' '}{outputMetrics.find(m => m.id === selectedMetric)?.name}
              </p>
            </div>
            
            <div className="aspect-video w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getChartData()}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" label={{ value: 'Impact (%)', position: 'insideBottom', offset: -5 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={140} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="custom-tooltip bg-background border rounded-md shadow-md p-3 text-sm">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-xs mb-1">Baseline: {formatValue(data.baselineValue, selectedMetric)}</p>
                            <div className="space-y-1 mt-2">
                              <p className="text-xs">
                                <span className="inline-block w-3 h-3 bg-red-500 mr-2 rounded-sm"></span>
                                -10%: {formatValue(data.negativeValue, selectedMetric)}
                                {' '}({(data.negativeValue - data.baselineValue) > 0 ? '+' : ''}
                                {((data.negativeValue - data.baselineValue) / data.baselineValue * 100).toFixed(1)}%)
                              </p>
                              <p className="text-xs">
                                <span className="inline-block w-3 h-3 bg-eco-500 mr-2 rounded-sm"></span>
                                +10%: {formatValue(data.positiveValue, selectedMetric)}
                                {' '}({(data.positiveValue - data.baselineValue) > 0 ? '+' : ''}
                                {((data.positiveValue - data.baselineValue) / data.baselineValue * 100).toFixed(1)}%)
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine x={0} stroke="#888" />
                  <Bar dataKey="negative" fill="#ef4444" name="-10% Change" />
                  <Bar dataKey="positive" fill="#22c55e" name="+10% Change" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {results.length > 0 && (
              <div className="text-sm">
                <p className="font-medium">Key Insights:</p>
                <ul className="list-disc pl-5 pt-1 text-muted-foreground">
                  <li>
                    {results[0].variable} has the highest impact on {outputMetrics.find(m => m.id === selectedMetric)?.name}
                  </li>
                  {results.some(r => Math.abs(r.impact) < 10) && (
                    <li className="text-amber-600">
                      Some variables show low sensitivity (less than 10% impact)
                    </li>
                  )}
                </ul>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 justify-between pt-4">
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handleAdjustInputs}>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Adjust Inputs
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save to Report
                </Button>
              </div>
              <Button onClick={handleReset}>Done</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Sensitivity Analysis</DialogTitle>
          <DialogDescription>
            Analyze how changes in input variables affect key project metrics.
          </DialogDescription>
        </DialogHeader>
        
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};

export default SensitivityAnalysisDialog;
