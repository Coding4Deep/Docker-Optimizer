
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings, Bell, Shield, Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [maxFileSize, setMaxFileSize] = useState("100");
  const { toast } = useToast();

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('dockerAnalyzer_autoAnalysis', autoAnalysis.toString());
    localStorage.setItem('dockerAnalyzer_notifications', notifications.toString());
    localStorage.setItem('dockerAnalyzer_maxFileSize', maxFileSize);
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
    onOpenChange(false);
  };

  const exportSettings = () => {
    const settings = {
      autoAnalysis,
      notifications,
      maxFileSize,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `docker-analyzer-settings-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Settings Exported",
      description: "Settings configuration has been downloaded.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <Settings className="w-5 h-5 mr-2 text-blue-400" />
            Application Settings
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Configure your Docker Analyzer preferences and system settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-96 overflow-y-auto">
          {/* Analysis Settings */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                Analysis Settings
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure how Docker images are analyzed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-analysis" className="text-slate-300">
                  Auto-start analysis on upload
                </Label>
                <Switch
                  id="auto-analysis"
                  checked={autoAnalysis}
                  onCheckedChange={setAutoAnalysis}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-file-size" className="text-slate-300">
                  Maximum file size (MB)
                </Label>
                <Input
                  id="max-file-size"
                  type="number"
                  value={maxFileSize}
                  onChange={(e) => setMaxFileSize(e.target.value)}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="w-4 h-4 mr-2 text-yellow-400" />
                Notifications
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-slate-300">
                  Enable notifications
                </Label>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-600">
          <Button
            variant="outline"
            onClick={exportSettings}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
