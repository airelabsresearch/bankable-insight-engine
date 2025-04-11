
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUp, Upload, CheckCircle2, AlertCircle, UploadCloud, FileSpreadsheet, Table, Grid3X3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Upload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState('');

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
    
    // Check if file is Excel
    const validExts = ['.xlsx', '.xls', '.xlsm', '.csv'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExts.includes(fileExt)) {
      setUploadState('error');
      return;
    }

    setFileName(file.name);
    setUploadState('uploading');
    
    // Simulate upload
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploadState('success');
      }
    }, 100);
  };

  const resetUpload = () => {
    setUploadState('idle');
    setUploadProgress(0);
    setFileName('');
  };

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
                          Uploading... {uploadProgress}%
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
                      <div className="mt-4 flex justify-center space-x-2">
                        <Button onClick={resetUpload} variant="outline">
                          Upload Another
                        </Button>
                        <Button>Continue to Interpretation</Button>
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
                      <Upload className="h-5 w-5 text-bankable-700" />
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
    </div>
  );
};

export default Upload;
