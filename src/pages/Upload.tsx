import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileUp, 
  Upload as UploadIcon, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  FileSpreadsheet, 
  Table, 
  Grid3X3,
  ChevronRight,
  Activity,
  CheckCircle,
  FileText,
  X,
  Layers,
  Shield
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const mockModules = [
  {
    "Module": "Solar",
    "Attribute": "CAPEX ($/kW)",
    "Value": "950"
  },
  {
    "Module": "Solar",
    "Attribute": "Efficiency (%)",
    "Value": "20.5"
  },
  {
    "Module": "Solar",
    "Attribute": "Degradation Rate (%/yr)",
    "Value": "0.5"
  },
  {
    "Module": "Battery",
    "Attribute": "Capacity (MWh)",
    "Value": "50"
  },
  {
    "Module": "Battery",
    "Attribute": "Round-trip Efficiency (%)",
    "Value": "87"
  },
  {
    "Module": "Battery",
    "Attribute": "Cost ($/kWh)",
    "Value": "275"
  },
  {
    "Module": "Battery",
    "Attribute": "Cycle Life",
    "Value": "4000"
  },
  {
    "Module": "Hydrogen",
    "Attribute": "Electrolyzer Capacity (MW)",
    "Value": "5"
  },
  {
    "Module": "Hydrogen",
    "Attribute": "Conversion Efficiency (%)",
    "Value": "72"
  },
  {
    "Module": "Hydrogen",
    "Attribute": "CAPEX ($/kg H₂/day)",
    "Value": "1250"
  },
  {
    "Module": "Hydrogen",
    "Attribute": "Operating Hours",
    "Value": "6000"
  },
  {
    "Module": "Financing",
    "Attribute": "Debt Ratio (%)",
    "Value": "70"
  },
  {
    "Module": "Financing",
    "Attribute": "Interest Rate (%)",
    "Value": "5.2"
  },
  {
    "Module": "Financing",
    "Attribute": "WACC (%)",
    "Value": "7.5"
  },
  {
    "Module": "Financing",
    "Attribute": "Tenor (years)",
    "Value": "20"
  },
  {
    "Module": "Policy",
    "Attribute": "ITC (%)",
    "Value": "30"
  },
  {
    "Module": "Policy",
    "Attribute": "PTC ($/MWh)",
    "Value": "26"
  },
  {
    "Module": "Policy",
    "Attribute": "Carbon Credit Value ($/ton)",
    "Value": "35"
  },
  {
    "Module": "CapEx Summary",
    "Attribute": "Total Installed Cost",
    "Value": "$125M"
  },
  {
    "Module": "CapEx Summary",
    "Attribute": "Contingency (%)",
    "Value": "10"
  },
  {
    "Module": "CapEx Summary",
    "Attribute": "Developer Fee",
    "Value": "$2.5M"
  },
  {
    "Module": "OpEx Summary",
    "Attribute": "Fixed O&M ($/year)",
    "Value": "$1.2M"
  },
  {
    "Module": "OpEx Summary",
    "Attribute": "Variable O&M ($/MWh)",
    "Value": "3.75"
  },
  {
    "Module": "OpEx Summary",
    "Attribute": "Escalation Rate (%)",
    "Value": "2.1"
  },
  {
    "Module": "Outputs",
    "Attribute": "IRR (%)",
    "Value": "12.3"
  },
  {
    "Module": "Outputs",
    "Attribute": "NPV ($)",
    "Value": "$42.7M"
  },
  {
    "Module": "Outputs",
    "Attribute": "Payback Period (years)",
    "Value": "7.2"
  },
  {
    "Module": "Outputs",
    "Attribute": "Levelized Cost of Hydrogen (LCOH)",
    "Value": "$3.80/kg"
  },
  {
    "Module": "Cash Flow Statement",
    "Attribute": "Net Cash Flow",
    "Value": "Dynamic" 
  },
  {
    "Module": "Cash Flow Statement",
    "Attribute": "Cumulative Cash Flow",
    "Value": "Dynamic"
  },
  {
    "Module": "Cash Flow Statement",
    "Attribute": "EBITDA",
    "Value": "Dynamic"
  },
  {
    "Module": "Inputs Sheet",
    "Attribute": "Technical Assumptions",
    "Value": "Multiple"
  },
  {
    "Module": "Inputs Sheet",
    "Attribute": "Financial Assumptions",
    "Value": "Multiple"
  },
  {
    "Module": "Inputs Sheet",
    "Attribute": "Market Assumptions",
    "Value": "Multiple"
  }
];

const mockSheets = [
  { name: "Input Assumptions", type: "inputs", color: "bg-blue-100 text-blue-800" },
  { name: "CAPEX Calculation", type: "calculation", color: "bg-amber-100 text-amber-800" },
  { name: "Operations", type: "calculation", color: "bg-amber-100 text-amber-800" },
  { name: "Cash Flow", type: "outputs", color: "bg-green-100 text-green-800" },
  { name: "KPI Summary", type: "outputs", color: "bg-green-100 text-green-800" },
  { name: "Sensitivity", type: "analysis", color: "bg-purple-100 text-purple-800" }
];

const ModuleCard = ({ moduleName, attributes }) => {
  return (
    <div className="border rounded-lg p-4 hover:border-bankable-300 transition-colors bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="h-5 w-5 text-bankable-600" />
        <h3 className="font-medium">{moduleName}</h3>
      </div>
      <div className="space-y-2">
        {attributes.map((attr, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{attr.Attribute}</span>
            <span className="font-medium">{attr.Value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FileUploadPage: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error' | 'analyzing' | 'analyzed'>('idle');
  const [fileName, setFileName] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');
  const [analysisLog, setAnalysisLog] = useState<string[]>([]);
  const [showAnalysisSheet, setShowAnalysisSheet] = useState(false);
  const [activeView, setActiveView] = useState<'upload' | 'analysis' | 'explorer'>('upload');
  const [groupedModules, setGroupedModules] = useState<Record<string, any[]>>({});
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (uploadState === 'analyzed') {
      const grouped = mockModules.reduce((acc, item) => {
        if (!acc[item.Module]) {
          acc[item.Module] = [];
        }
        acc[item.Module].push(item);
        return acc;
      }, {} as Record<string, any[]>);
      setGroupedModules(grouped);
    }
  }, [uploadState]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    
    const validExts = ['.xlsx', '.xls', '.xlsm', '.csv'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExts.includes(fileExt)) {
      setUploadState('error');
      return;
    }

    setFileName(file.name);
    setUploadState('uploading');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploadState('success');
        
        setTimeout(() => {
          startAnalysis();
        }, 500);
      }
    }, 100);
  };

  const startAnalysis = () => {
    setUploadState('analyzing');
    setAnalysisProgress(0);
    setAnalysisLog([]);
    
    const steps = [
      { message: "Scanning Excel structure...", duration: 600 },
      { message: "Identifying input sheets...", duration: 800 },
      { message: "Detecting calculation tabs...", duration: 700 },
      { message: "Mapping cell dependencies...", duration: 1100 },
      { message: "Finding financial outputs...", duration: 900 },
      { message: "Recognizing module structures...", duration: 1200 },
      { message: "Extracting key parameters...", duration: 850 },
      { message: "Detecting formulas and relationships...", duration: 1300 },
      { message: "Building module connections...", duration: 1000 },
      { message: "Finalizing model structure...", duration: 750 }
    ];
    
    let currentStep = 0;
    let currentProgress = 0;
    
    const simulateAnalysis = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setAnalysisStep(step.message);
        setAnalysisLog(prev => [...prev, step.message]);
        
        const progressIncrement = 100 / steps.length;
        const startProgress = currentProgress;
        const targetProgress = startProgress + progressIncrement;
        
        let innerProgress = 0;
        const progressInterval = setInterval(() => {
          innerProgress += 5;
          const calculatedProgress = startProgress + (innerProgress / 100) * progressIncrement;
          setAnalysisProgress(Math.min(calculatedProgress, targetProgress));
          
          if (innerProgress >= 100) {
            clearInterval(progressInterval);
            currentProgress = targetProgress;
            currentStep++;
            
            setAnalysisLog(prev => [...prev, `✅ ${step.message.replace('...', '')}`]);
            
            setTimeout(simulateAnalysis, 100);
          }
        }, step.duration / 20);
      } else {
        setAnalysisProgress(100);
        setAnalysisStep("Analysis complete!");
        
        setAnalysisLog(prev => [
          ...prev, 
          "✅ Analysis complete!",
          "📊 Identified 10 modules across 6 sheets",
          "🔗 Mapped 127 parameters and 45 formula connections"
        ]);
        
        setTimeout(() => {
          setUploadState('analyzed');
          setShowAnalysisSheet(true);
        }, 1000);
      }
    };
    
    simulateAnalysis();
  };

  const resetUpload = () => {
    setUploadState('idle');
    setUploadProgress(0);
    setFileName('');
    setAnalysisProgress(0);
    setAnalysisLog([]);
    setActiveView('upload');
  };

  const handleContinueToExplorer = () => {
    setActiveView('explorer');
    setShowAnalysisSheet(false);
    toast({
      title: "Model Successfully Analyzed",
      description: "Your model has been processed and is ready for scenario planning.",
    });
  };

  const handleGoToRiskAnalysis = () => {
    toast({
      title: "Redirecting to Risk Analysis",
      description: "Opening risk analysis tools for your model.",
    });
    navigate('/risk');
  };

  const renderUploadView = () => (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-1 h-full">
        <CardHeader>
          <CardTitle>Upload Model</CardTitle>
          <CardDescription>
            Upload an Excel-based TEA or project finance model to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className={`border-2 border-dashed rounded-lg p-10 ${
              dragActive ? 'border-bankable-500 bg-bankable-50' : 'border-gray-300'
            } transition-colors text-center`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploadState === 'idle' && (
              <>
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4">
                  <p className="font-medium text-gray-900">
                    Drag and drop your Excel file here
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports .xlsx, .xls, .xlsm, .csv files up to 50MB
                  </p>
                </div>
                <div className="mt-6">
                  <Input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".xlsx,.xls,.xlsm,.csv"
                    onChange={handleChange}
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileUp className="mr-2 h-4 w-4" />
                      Browse Files
                    </label>
                  </Button>
                </div>
              </>
            )}

            {uploadState === 'uploading' && (
              <div className="py-6">
                <FileSpreadsheet className="mx-auto h-10 w-10 text-bankable-600" />
                <p className="mt-4 text-sm font-medium">{fileName}</p>
                <div className="mt-4">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              </div>
            )}

            {uploadState === 'success' && (
              <div className="py-6">
                <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
                <p className="mt-4 font-medium text-green-700">Upload Complete!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {fileName} has been uploaded successfully
                </p>
                <div className="mt-4">
                  <p className="text-sm text-bankable-600 animate-pulse">Preparing to analyze model...</p>
                </div>
              </div>
            )}

            {uploadState === 'analyzing' && (
              <div className="py-6">
                <Activity className="mx-auto h-10 w-10 text-bankable-600 animate-pulse" />
                <p className="mt-4 font-medium text-bankable-700">{analysisStep}</p>
                <div className="mt-4">
                  <Progress value={analysisProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.round(analysisProgress)}% complete
                  </p>
                </div>
                <div className="mt-4 text-left max-h-32 overflow-y-auto bg-muted p-2 rounded text-xs">
                  {analysisLog.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadState === 'analyzed' && (
              <div className="py-6">
                <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
                <p className="mt-4 font-medium text-green-700">Analysis Complete!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Model structure has been successfully extracted
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  <Button onClick={resetUpload} variant="outline">
                    Upload Another
                  </Button>
                  <Button onClick={handleContinueToExplorer}>
                    View Results
                  </Button>
                </div>
              </div>
            )}

            {uploadState === 'error' && (
              <div className="py-6">
                <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
                <p className="mt-4 font-medium text-red-700">Upload Failed</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please ensure you're uploading a valid Excel or CSV file
                </p>
                <Button onClick={resetUpload} variant="outline" className="mt-4">
                  Try Again
                </Button>
              </div>
            )}
          </div>

          {uploadState === 'idle' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Your files will be securely uploaded and processed
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Model Interpretation</CardTitle>
          <CardDescription>
            Our AI system will interpret your model to identify key components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Table className="h-5 w-5 text-bankable-700" />
                <h3 className="font-medium">Identifies Key Sheets</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Automatically detects inputs, calculations, and results sheets
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Grid3X3 className="h-5 w-5 text-bankable-700" />
                <h3 className="font-medium">Extracts Model Structure</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Identifies components like CAPEX, OPEX, revenue streams, and technical parameters
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <UploadIcon className="h-5 w-5 text-bankable-700" />
                <h3 className="font-medium">Creates Modular Architecture</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Transforms Excel logic into structured modules you can manipulate
              </p>
            </div>

            <Separator className="my-4" />

            <div>
              <p className="text-sm">Supported Model Types:</p>
              <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside space-y-1">
                <li>Techno-economic assessments (TEA)</li>
                <li>Project finance models</li>
                <li>Cash flow projections</li>
                <li>LCOE calculations</li>
                <li>Capacity expansion models</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalysisResultsView = () => (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Model Analysis Results</CardTitle>
              <CardDescription>
                Here's what we found in your Excel model: {fileName}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={resetUpload}>
              <X className="h-4 w-4 mr-2" />
              Close Analysis
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Model Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700">10</p>
                  <p className="text-sm text-blue-600">Modules</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">34</p>
                  <p className="text-sm text-green-600">Attributes</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-amber-700">6</p>
                  <p className="text-sm text-amber-600">Sheets</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-purple-700">45</p>
                  <p className="text-sm text-purple-600">Formulas</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-3">Detected Sheets</h3>
              <div className="flex flex-wrap gap-2">
                {mockSheets.map((sheet, index) => (
                  <Badge key={index} variant="outline" className={`${sheet.color} border-none`}>
                    {sheet.name}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-3">Identified Modules</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(groupedModules).map((moduleName) => (
                  <ModuleCard 
                    key={moduleName} 
                    moduleName={moduleName} 
                    attributes={groupedModules[moduleName]}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button size="lg" onClick={handleContinueToExplorer}>
                Continue to Module Explorer
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleGoToRiskAnalysis}>
                Go to Risk Analysis
                <Shield className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderModuleExplorerView = () => (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Module Explorer</CardTitle>
              <CardDescription>
                Build scenarios by modifying modules and their attributes
              </CardDescription>
            </div>
            <Button variant="outline" onClick={resetUpload}>
              <FileUp className="h-4 w-4 mr-2" />
              Upload Another Model
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-bankable-200 bg-bankable-50 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-bankable-400 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-bankable-700">Model Ready for Scenario Development</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Your model has been processed and organized into modules. You can now create scenarios or analyze risks.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button onClick={() => {
                window.location.href = '/scenarios';
              }}>
                Create Your First Scenario
              </Button>
              <Button variant="outline" onClick={handleGoToRiskAnalysis}>
                Analyze Project Risks
                <Shield className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Model Upload</h1>
        <p className="text-muted-foreground">
          Upload and interpret your TEA or project finance models
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upload">Upload Model</TabsTrigger>
          <TabsTrigger value="recent">Recent Uploads</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-0">
          {activeView === 'upload' && renderUploadView()}
          {activeView === 'analysis' && renderAnalysisResultsView()}
          {activeView === 'explorer' && renderModuleExplorerView()}
        </TabsContent>
        
        <TabsContent value="recent" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>Models you've recently uploaded to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You haven't uploaded any models yet
                </p>
                <Button className="mt-4" asChild>
                  <a href="#upload">Upload Your First Model</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Model Templates</CardTitle>
              <CardDescription>Pre-built templates for common project types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {["Hydrogen Production", "Solar + Storage", "Carbon Capture", "E-Fuels", "SAF", "Battery Storage"].map((template) => (
                  <div key={template} className="border rounded-lg p-4 hover:border-bankable-400 transition-colors">
                    <FileSpreadsheet className="h-8 w-8 text-bankable-600 mb-2" />
                    <h3 className="font-medium text-sm">{template}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Standard TEA model</p>
                    <Button variant="link" className="text-xs px-0 mt-2">Download Template</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Sheet open={showAnalysisSheet} onOpenChange={setShowAnalysisSheet}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Model Analysis Complete</SheetTitle>
            <SheetDescription>
              We've successfully analyzed your Excel model and identified the following components:
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                <span className="font-medium">10 modules</span> identified, including: Solar, Battery, Hydrogen, Financing, Policy
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-sm text-green-800">
                <span className="font-medium">34 key attributes</span> extracted, such as CAPEX, efficiency values, and financial rates
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-md">
              <p className="text-sm text-amber-800">
                <span className="font-medium">6 sheets</span> categorized, including inputs, calculations, and financial summaries
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-md">
              <p className="text-sm text-purple-800">
                <span className="font-medium">45 formula relationships</span> mapped between modules, enabling scenario analysis
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-2 mt-6">
            <Button onClick={handleContinueToExplorer}>
              Continue to Module Explorer
            </Button>
            <Button variant="outline" onClick={() => setShowAnalysisSheet(false)}>
              View Detailed Analysis
            </Button>
            <Button variant="outline" onClick={handleGoToRiskAnalysis}>
              Go to Risk Analysis
              <Shield className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FileUploadPage;
