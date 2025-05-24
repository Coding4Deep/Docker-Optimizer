
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Upload, FileText, Clock, TrendingUp, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const DashboardOverview = () => {
  const services = [
    { name: "API Gateway", status: "healthy", uptime: "99.9%", color: "bg-green-500" },
    { name: "Analyzer Service", status: "healthy", uptime: "98.7%", color: "bg-green-500" },
    { name: "DockerHub Puller", status: "healthy", uptime: "99.2%", color: "bg-green-500" },
    { name: "Report Generator", status: "degraded", uptime: "95.1%", color: "bg-yellow-500" },
    { name: "Storage Service", status: "healthy", uptime: "99.8%", color: "bg-green-500" },
    { name: "RabbitMQ", status: "healthy", uptime: "99.9%", color: "bg-green-500" },
  ];

  const recentAnalyses = [
    { name: "nginx:alpine", time: "2 minutes ago", score: 85, status: "optimized" },
    { name: "node:18-slim", time: "15 minutes ago", score: 72, status: "needs improvement" },
    { name: "python:3.9", time: "1 hour ago", score: 45, status: "critical" },
    { name: "redis:7-alpine", time: "3 hours ago", score: 92, status: "excellent" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Analyses</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,247</div>
            <p className="text-xs text-slate-400">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Queue Tasks</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">23</div>
            <p className="text-xs text-slate-400">Active processing</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Avg Optimization</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">67%</div>
            <p className="text-xs text-slate-400">Size reduction achieved</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8.4/10</div>
            <p className="text-xs text-slate-400">Average security rating</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Microservices Status */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Microservices Health</CardTitle>
            <CardDescription className="text-slate-400">
              Real-time status of all system components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${service.color}`} />
                  <span className="text-sm text-slate-300">{service.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">{service.uptime}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    service.status === 'healthy' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Analyses */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Analyses</CardTitle>
            <CardDescription className="text-slate-400">
              Latest Docker image optimization results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAnalyses.map((analysis, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">{analysis.name}</span>
                  <span className="text-xs text-slate-400">{analysis.time}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Progress value={analysis.score} className="flex-1" />
                  <span className="text-sm text-slate-300">{analysis.score}%</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    analysis.status === 'excellent' ? 'bg-green-900 text-green-300' :
                    analysis.status === 'optimized' ? 'bg-blue-900 text-blue-300' :
                    analysis.status === 'needs improvement' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {analysis.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
