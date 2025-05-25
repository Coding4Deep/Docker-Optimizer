import { useState } from "react";
import { Upload, Search, FileText, Activity, Settings, BarChart3 } from "lucide-react";
import DashboardOverview from "@/components/DashboardOverview";
import DockerFileUpload from "@/components/DockerFileUpload";
import AnalysisReport from "@/components/AnalysisReport";
import DockerHubPuller from "@/components/DockerHubPuller";
import SettingsDialog from "@/components/SettingsDialog";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeReport, setActiveReport] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Docker Analyzer</h1>
                <p className="text-sm text-slate-400">Microservices DevOps Platform - By Deepak Sagar</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Upload className="w-4 h-4 mr-2" />
              Upload Analysis
            </TabsTrigger>
            <TabsTrigger value="dockerhub" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Search className="w-4 h-4 mr-2" />
              DockerHub Puller
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="upload">
            <DockerFileUpload onAnalysisComplete={setActiveReport} />
          </TabsContent>

          <TabsContent value="dockerhub">
            <DockerHubPuller onAnalysisComplete={setActiveReport} />
          </TabsContent>

          <TabsContent value="reports">
            {activeReport ? (
              <AnalysisReport report={activeReport} />
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">No Reports Available</CardTitle>
                  <CardDescription className="text-slate-400">
                    Upload a Dockerfile or pull an image to generate analysis reports.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default Index;
