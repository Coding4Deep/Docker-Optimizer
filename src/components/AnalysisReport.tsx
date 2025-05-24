
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
  Info
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisReportProps {
  report: any;
}

const AnalysisReport = ({ report }: AnalysisReportProps) => {
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
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Download className="w-4 h-4 mr-2" />
                Export HTML
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
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
      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="issues" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Issues & Suggestions
          </TabsTrigger>
          <TabsTrigger value="optimizations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Optimizations
          </TabsTrigger>
          <TabsTrigger value="before-after" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Before vs After
          </TabsTrigger>
        </TabsList>

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

        <TabsContent value="optimizations" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recommended Optimizations</CardTitle>
              <CardDescription className="text-slate-400">
                Best practices to improve your Docker image
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.optimizations.map((optimization, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{optimization}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
