import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  TrendingDown, 
  Shield, 
  Layers, 
  AlertTriangle,
  CheckCircle,
  Info,
  Code,
  Terminal
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface AnalysisReportProps {
  report: any;
}

const AnalysisReport = ({ report }: AnalysisReportProps) => {
  const { toast } = useToast();

  const exportToHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Docker Analysis Report - ${report.fileName || report.imageName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background: #1e293b; color: white; padding: 20px; border-radius: 8px; }
            .metric { background: #f1f5f9; padding: 15px; margin: 10px 0; border-radius: 6px; }
            .issue { border-left: 4px solid #ef4444; padding: 15px; margin: 10px 0; background: #fef2f2; }
            .optimization { border-left: 4px solid #10b981; padding: 15px; margin: 10px 0; background: #f0fdf4; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Docker Analysis Report</h1>
            <p>${report.fileName || report.imageName} • ${new Date(report.analysisDate).toLocaleString()}</p>
          </div>
          <div class="metric">
            <h3>Size Reduction: ${report.sizeReduction}</h3>
            <p>${report.originalSize} → ${report.optimizedSize}</p>
          </div>
          <div class="metric">
            <h3>Security Score: ${report.securityScore}/10</h3>
            <h3>Layers: ${report.optimizedLayers} (reduced from ${report.layers})</h3>
          </div>
          <h2>Issues Found</h2>
          ${report.issues.map(issue => `
            <div class="issue">
              <h3>${issue.type} (${issue.severity})</h3>
              <p><strong>Issue:</strong> ${issue.description}</p>
              <p><strong>Recommendation:</strong> ${issue.suggestion}</p>
              <p><strong>Impact:</strong> ${issue.impact}</p>
            </div>
          `).join('')}
          <h2>Optimization Steps</h2>
          ${report.optimizations.map(opt => `
            <div class="optimization">✓ ${opt}</div>
          `).join('')}
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `docker-analysis-${report.fileName || report.imageName}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "HTML Report Exported",
      description: "Report has been downloaded successfully.",
    });
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `docker-analysis-${report.fileName || report.imageName}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "JSON Report Exported",
      description: "Report has been downloaded successfully.",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-900 text-red-300 border-red-600';
      case 'medium': return 'bg-yellow-900 text-yellow-300 border-yellow-600';
      case 'low': return 'bg-blue-900 text-blue-300 border-blue-600';
      default: return 'bg-slate-900 text-slate-300 border-slate-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-400" />
                Analysis Report
              </CardTitle>
              <CardDescription className="text-slate-400">
                {report.fileName || report.imageName} • {new Date(report.analysisDate).toLocaleString()}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={exportToHTML}
              >
                <Download className="w-4 h-4 mr-2" />
                Export HTML
              </Button>
              <Button 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={exportToJSON}
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Size Reduction</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{report.sizeReduction}</div>
            <p className="text-xs text-slate-400">
              {report.originalSize} → {report.optimizedSize}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{report.securityScore}/10</div>
            <Progress value={report.securityScore * 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Layers</CardTitle>
            <Layers className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{report.optimizedLayers}</div>
            <p className="text-xs text-slate-400">
              Reduced from {report.layers} layers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Issues Found</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{report.issues.length}</div>
            <p className="text-xs text-slate-400">
              Optimization opportunities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="optimization-steps" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="optimization-steps" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Terminal className="w-4 h-4 mr-2" />
            Optimization Steps
          </TabsTrigger>
          <TabsTrigger value="issues" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Issues & Suggestions
          </TabsTrigger>
          <TabsTrigger value="dockerfile-alternatives" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Code className="w-4 h-4 mr-2" />
            Dockerfile Alternatives
          </TabsTrigger>
          <TabsTrigger value="before-after" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Before vs After
          </TabsTrigger>
        </TabsList>

        <TabsContent value="optimization-steps" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Step-by-Step Size Reduction Guide</CardTitle>
              <CardDescription className="text-slate-400">
                Follow these steps to optimize your Docker image and reduce size
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-white mb-2">1. Use Smaller Base Images</h4>
                  <p className="text-slate-300 mb-2">Replace heavy base images with minimal alternatives:</p>
                  <div className="bg-slate-900 p-3 rounded text-sm text-green-400">
                    <p># Instead of: FROM ubuntu:20.04</p>
                    <p>FROM alpine:3.18</p>
                    <p># Or: FROM node:18-alpine</p>
                    <p># Or: FROM python:3.9-slim</p>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">Potential savings: 200-500MB</p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-white mb-2">2. Combine RUN Commands</h4>
                  <p className="text-slate-300 mb-2">Merge multiple RUN statements to reduce layers:</p>
                  <div className="bg-slate-900 p-3 rounded text-sm">
                    <p className="text-red-400"># Bad - Multiple layers:</p>
                    <p className="text-red-400">RUN apt-get update</p>
                    <p className="text-red-400">RUN apt-get install -y curl</p>
                    <p className="text-red-400">RUN apt-get clean</p>
                    <br />
                    <p className="text-green-400"># Good - Single layer:</p>
                    <p className="text-green-400">RUN apt-get update && \</p>
                    <p className="text-green-400">    apt-get install -y curl && \</p>
                    <p className="text-green-400">    apt-get clean && \</p>
                    <p className="text-green-400">    rm -rf /var/lib/apt/lists/*</p>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">Potential savings: 50-200MB</p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-white mb-2">3. Remove Package Managers & Cache</h4>
                  <p className="text-slate-300 mb-2">Clean up after package installation:</p>
                  <div className="bg-slate-900 p-3 rounded text-sm text-green-400">
                    <p>RUN apt-get update && \</p>
                    <p>    apt-get install -y --no-install-recommends curl && \</p>
                    <p>    apt-get purge -y --auto-remove && \</p>
                    <p>    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*</p>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">Potential savings: 100-300MB</p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-white mb-2">4. Use Multi-Stage Builds</h4>
                  <p className="text-slate-300 mb-2">Separate build and runtime environments:</p>
                  <div className="bg-slate-900 p-3 rounded text-sm text-green-400">
                    <p># Build stage</p>
                    <p>FROM node:18-alpine AS builder</p>
                    <p>WORKDIR /app</p>
                    <p>COPY package*.json ./</p>
                    <p>RUN npm ci --only=production</p>
                    <br />
                    <p># Runtime stage</p>
                    <p>FROM node:18-alpine</p>
                    <p>WORKDIR /app</p>
                    <p>COPY --from=builder /app/node_modules ./node_modules</p>
                    <p>COPY . .</p>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">Potential savings: 300-800MB</p>
                </div>

                <div className="border-l-4 border-cyan-500 pl-4">
                  <h4 className="font-semibold text-white mb-2">5. Optimize COPY Commands</h4>
                  <p className="text-slate-300 mb-2">Copy only necessary files and use .dockerignore:</p>
                  <div className="bg-slate-900 p-3 rounded text-sm">
                    <p className="text-red-400"># Bad:</p>
                    <p className="text-red-400">COPY . .</p>
                    <br />
                    <p className="text-green-400"># Good:</p>
                    <p className="text-green-400">COPY package*.json ./</p>
                    <p className="text-green-400">RUN npm install</p>
                    <p className="text-green-400">COPY src/ ./src/</p>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">Create .dockerignore with node_modules, .git, tests, docs</p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-white mb-2">6. Use Distroless Images</h4>
                  <p className="text-slate-300 mb-2">For production, use Google's distroless images:</p>
                  <div className="bg-slate-900 p-3 rounded text-sm text-green-400">
                    <p>FROM gcr.io/distroless/nodejs18-debian11</p>
                    <p>COPY --from=builder /app .</p>
                    <p>EXPOSE 3000</p>
                    <p>CMD ["server.js"]</p>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">Potential savings: 100-400MB + improved security</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dockerfile-alternatives" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                  Current Dockerfile Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-slate-900 p-4 rounded text-sm">
                  <p className="text-red-400"># Problematic Dockerfile</p>
                  <p className="text-slate-300">FROM ubuntu:20.04</p>
                  <p className="text-slate-300">RUN apt-get update</p>
                  <p className="text-slate-300">RUN apt-get install -y nodejs npm</p>
                  <p className="text-slate-300">RUN apt-get install -y python3 pip</p>
                  <p className="text-slate-300">COPY . .</p>
                  <p className="text-slate-300">RUN npm install</p>
                  <p className="text-slate-300">CMD ["npm", "start"]</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-red-400">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Heavy base image (Ubuntu)</span>
                  </div>
                  <div className="flex items-center text-red-400">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Multiple RUN layers</span>
                  </div>
                  <div className="flex items-center text-red-400">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm">No cleanup commands</span>
                  </div>
                  <div className="flex items-center text-red-400">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Copies unnecessary files</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 border-green-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  Optimized Dockerfile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-slate-900 p-4 rounded text-sm">
                  <p className="text-green-400"># Optimized Multi-stage Dockerfile</p>
                  <p className="text-slate-300">FROM node:18-alpine AS builder</p>
                  <p className="text-slate-300">WORKDIR /app</p>
                  <p className="text-slate-300">COPY package*.json ./</p>
                  <p className="text-slate-300">RUN npm ci --only=production && \</p>
                  <p className="text-slate-300">    npm cache clean --force</p>
                  <br />
                  <p className="text-slate-300">FROM node:18-alpine</p>
                  <p className="text-slate-300">WORKDIR /app</p>
                  <p className="text-slate-300">COPY --from=builder /app/node_modules ./node_modules</p>
                  <p className="text-slate-300">COPY src/ ./src/</p>
                  <p className="text-slate-300">USER node</p>
                  <p className="text-slate-300">CMD ["node", "src/server.js"]</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Alpine base (minimal)</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Multi-stage build</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Cache cleanup</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Selective file copying</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Non-root user</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          {report.issues.map((issue, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(issue.severity)}
                    <CardTitle className="text-lg text-white">{issue.type}</CardTitle>
                    <Badge className={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </Badge>
                  </div>
                  <span className="text-sm text-green-400">{issue.impact}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-1">Issue</h4>
                  <p className="text-slate-400">{issue.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-1">Recommendation</h4>
                  <p className="text-white">{issue.suggestion}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="before-after" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Before Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Image Size</span>
                    <span className="text-white">{report.originalSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Layers</span>
                    <span className="text-white">{report.layers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Security Score</span>
                    <span className="text-white">{(report.securityScore - 1.2).toFixed(1)}/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 border-green-600/50">
              <CardHeader>
                <CardTitle className="text-white">After Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Image Size</span>
                    <span className="text-green-400">{report.optimizedSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Layers</span>
                    <span className="text-green-400">{report.optimizedLayers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Security Score</span>
                    <span className="text-green-400">{report.securityScore}/10</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-green-400">{report.sizeReduction}</span>
                    <p className="text-sm text-slate-400">Size Reduction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisReport;
