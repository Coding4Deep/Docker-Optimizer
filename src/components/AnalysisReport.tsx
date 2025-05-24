
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

  // Create specific optimization steps based on actual issues found
  const generateSpecificOptimizationSteps = () => {
    if (report.issues.length === 0) {
      return (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              No Optimization Needed
            </CardTitle>
            <CardDescription className="text-slate-400">
              Your Dockerfile follows best practices and no issues were found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Your Dockerfile is well-optimized and ready for production use.</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Optimization Steps Based on Your Dockerfile</CardTitle>
          <CardDescription className="text-slate-400">
            These steps are specifically tailored to the issues found in your Dockerfile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {report.issues.map((issue, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-white mb-2">{index + 1}. Fix: {issue.type}</h4>
              <p className="text-slate-300 mb-2">{issue.description}</p>
              <div className="bg-slate-900 p-3 rounded text-sm">
                <p className="text-green-400"># Recommended fix:</p>
                <p className="text-slate-300">{issue.suggestion}</p>
              </div>
              <p className="text-slate-400 text-sm mt-2">Expected impact: {issue.impact}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const generateDockerfileComparison = () => {
    const hasIssues = report.issues.length > 0;
    
    if (!hasIssues) {
      return (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Your Dockerfile is Optimized</h3>
          <p className="text-slate-400">No improvements needed at this time.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
              Issues Found in Your Dockerfile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.issues.map((issue, index) => (
              <div key={index} className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm text-red-400 font-medium">{issue.type}</span>
                  {issue.lineNumber && (
                    <span className="text-xs text-slate-500 ml-2">Line {issue.lineNumber}</span>
                  )}
                  <p className="text-sm text-slate-300">{issue.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 border-green-600/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Recommended Improvements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.issues.map((issue, index) => (
              <div key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm text-green-400 font-medium">Fix {issue.type}</span>
                  <p className="text-sm text-slate-300">{issue.suggestion}</p>
                  <p className="text-xs text-slate-400">Impact: {issue.impact}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
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
            Before vs After
          </TabsTrigger>
        </TabsList>

        <TabsContent value="optimization-steps" className="space-y-4">
          {generateSpecificOptimizationSteps()}
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          {report.issues.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  No Issues Found
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your Dockerfile follows best practices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Great job! Your Dockerfile is well-structured and follows Docker best practices. 
                  No optimization issues were detected.
                </p>
              </CardContent>
            </Card>
          ) : (
            report.issues.map((issue, index) => (
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
                  {issue.lineNumber && (
                    <CardDescription className="text-slate-400">
                      Line {issue.lineNumber}
                    </CardDescription>
                  )}
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
            ))
          )}
        </TabsContent>

        <TabsContent value="dockerfile-alternatives" className="space-y-4">
          {generateDockerfileComparison()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisReport;
