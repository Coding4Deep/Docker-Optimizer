import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DockerFileUploadProps {
  onAnalysisComplete: (report: any) => void;
}

const DockerFileUpload = ({ onAnalysisComplete }: DockerFileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dockerfileContent, setDockerfileContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeMethod, setActiveMethod] = useState<"upload" | "paste">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name === "Dockerfile" || droppedFile.name.includes("Dockerfile")) {
        setFile(droppedFile);
        setActiveMethod("upload");
      } else {
        toast({
          title: "Invalid file",
          description: "Please upload a Dockerfile",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setActiveMethod("upload");
    }
  };

  const simulateAnalysis = async () => {
    setAnalyzing(true);
    setProgress(0);

    const steps = [
      { step: "Parsing Dockerfile...", progress: 20 },
      { step: "Analyzing layers...", progress: 40 },
      { step: "Checking base image...", progress: 60 },
      { step: "Identifying optimizations...", progress: 80 },
      { step: "Generating report...", progress: 100 },
    ];

    for (const { step, progress } of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(progress);
      
      toast({
        title: "Analysis Progress",
        description: step,
      });
    }

    const mockReport = {
      fileName: activeMethod === "upload" ? file?.name : "Pasted Dockerfile",
      analysisDate: new Date().toISOString(),
      originalSize: "1.2 GB",
      optimizedSize: "456 MB",
      sizeReduction: "62%",
      securityScore: 8.2,
      layers: 12,
      optimizedLayers: 8,
      issues: [
        {
          severity: "high",
          type: "Base Image",
          description: "Using ubuntu:latest instead of ubuntu:20.04-slim",
          suggestion: "Use a specific, smaller base image",
          impact: "~300MB reduction"
        },
        {
          severity: "medium",
          type: "Layer Optimization", 
          description: "Multiple RUN commands can be combined",
          suggestion: "Combine RUN apt-get update && apt-get install",
          impact: "~2 layers reduction"
        }
      ],
      optimizations: [
        "Use multi-stage builds",
        "Minimize layers by combining commands",
        "Use .dockerignore file",
        "Remove package caches"
      ]
    };

    setAnalyzing(false);
    onAnalysisComplete(mockReport);
    
    toast({
      title: "Analysis Complete!",
      description: "Docker optimization report generated successfully.",
    });
  };

  const canAnalyze = (activeMethod === "upload" && file) || (activeMethod === "paste" && dockerfileContent.trim());

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Upload className="w-5 h-5 mr-2 text-blue-400" />
            Dockerfile Upload & Analysis
          </CardTitle>
          <CardDescription className="text-slate-400">
            Upload your Dockerfile or paste content directly for comprehensive optimization analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeMethod} onValueChange={(value) => setActiveMethod(value as "upload" | "paste")}>
            <TabsList className="bg-slate-700 border-slate-600">
              <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600">
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="paste" className="data-[state=active]:bg-blue-600">
                <Copy className="w-4 h-4 mr-2" />
                Paste Content
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-600 hover:border-slate-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".dockerfile,Dockerfile"
                />
                
                {file ? (
                  <div className="space-y-4">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-white">{file.name}</p>
                      <p className="text-sm text-slate-400">
                        {(file.size / 1024).toFixed(1)} KB • Ready for analysis
                      </p>
                    </div>
                    <Button
                      onClick={() => setFile(null)}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-white">Drop your Dockerfile here</p>
                      <p className="text-sm text-slate-400">
                        or click to browse files
                      </p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Select Dockerfile
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="paste" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="dockerfile-content" className="text-sm font-medium text-slate-300">
                  Dockerfile Content
                </label>
                <Textarea
                  id="dockerfile-content"
                  placeholder="FROM node:18-alpine&#10;WORKDIR /app&#10;COPY package*.json ./&#10;RUN npm install&#10;COPY . .&#10;EXPOSE 3000&#10;CMD [&quot;npm&quot;, &quot;start&quot;]"
                  value={dockerfileContent}
                  onChange={(e) => setDockerfileContent(e.target.value)}
                  className="min-h-[200px] bg-slate-700 border-slate-600 text-white font-mono text-sm"
                />
              </div>
              {dockerfileContent.trim() && (
                <div className="flex items-center space-x-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Dockerfile content ready for analysis</span>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Analysis Section */}
          {canAnalyze && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Docker Analysis</h3>
                <Button
                  onClick={simulateAnalysis}
                  disabled={analyzing}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Start Analysis"
                  )}
                </Button>
              </div>

              {analyzing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Analysis Progress</span>
                    <span className="text-slate-400">{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </div>
          )}

          {/* Analysis Queue Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-300">Analyzer Service</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Ready</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-300">Queue Length</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">3 tasks</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-slate-300">Est. Time</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">~2 minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DockerFileUpload;
