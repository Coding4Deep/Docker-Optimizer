
interface DockerInstruction {
  instruction: string;
  args: string;
  lineNumber: number;
  originalLine: string;
}

interface AnalysisIssue {
  severity: 'high' | 'medium' | 'low';
  type: string;
  description: string;
  suggestion: string;
  impact: string;
  lineNumber?: number;
}

interface AnalysisResult {
  fileName?: string;
  imageName?: string;
  analysisDate: string;
  originalSize: string;
  optimizedSize: string;
  sizeReduction: string;
  securityScore: number;
  layers: number;
  optimizedLayers: number;
  issues: AnalysisIssue[];
  optimizations: string[];
  hasIssues: boolean;
}

export const analyzeDockerfile = (content: string, fileName?: string): AnalysisResult => {
  const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  const instructions = parseInstructions(lines);
  const issues: AnalysisIssue[] = [];
  const optimizations: string[] = [];

  // Analyze base image
  analyzeBaseImage(instructions, issues, optimizations);
  
  // Analyze RUN commands
  analyzeRunCommands(instructions, issues, optimizations);
  
  // Analyze COPY/ADD commands
  analyzeCopyCommands(instructions, issues, optimizations);
  
  // Analyze general best practices
  analyzeGeneralPractices(instructions, issues, optimizations);
  
  // Calculate metrics
  const layerCount = countLayers(instructions);
  const optimizedLayers = Math.max(layerCount - Math.floor(layerCount * 0.3), 1);
  const securityScore = calculateSecurityScore(instructions, issues);
  
  // Estimate size reduction
  const sizeReduction = estimateSizeReduction(issues);

  return {
    fileName: fileName || 'Dockerfile',
    analysisDate: new Date().toISOString(),
    originalSize: '1.2 GB', // Would be calculated from actual image
    optimizedSize: `${Math.floor(1200 * (1 - sizeReduction / 100))} MB`,
    sizeReduction: `${sizeReduction}%`,
    securityScore,
    layers: layerCount,
    optimizedLayers,
    issues,
    optimizations,
    hasIssues: issues.length > 0
  };
};

const parseInstructions = (lines: string[]): DockerInstruction[] => {
  return lines.map((line, index) => {
    const trimmed = line.trim();
    const parts = trimmed.split(/\s+/);
    const instruction = parts[0].toUpperCase();
    const args = parts.slice(1).join(' ');
    
    return {
      instruction,
      args,
      lineNumber: index + 1,
      originalLine: trimmed
    };
  });
};

const analyzeBaseImage = (instructions: DockerInstruction[], issues: AnalysisIssue[], optimizations: string[]) => {
  const fromInstructions = instructions.filter(inst => inst.instruction === 'FROM');
  
  fromInstructions.forEach(inst => {
    const baseImage = inst.args.toLowerCase();
    
    // Check for latest tag
    if (baseImage.includes(':latest') || !baseImage.includes(':')) {
      issues.push({
        severity: 'medium',
        type: 'Base Image',
        description: 'Using :latest tag or no tag specified',
        suggestion: 'Use specific version tags for reproducible builds',
        impact: 'Better build reproducibility',
        lineNumber: inst.lineNumber
      });
    }
    
    // Check for heavy base images
    if (baseImage.includes('ubuntu') && !baseImage.includes('slim')) {
      issues.push({
        severity: 'high',
        type: 'Base Image Size',
        description: 'Using full Ubuntu image instead of slim variant',
        suggestion: 'Use ubuntu:20.04-slim or consider alpine-based images',
        impact: '~200-400MB reduction',
        lineNumber: inst.lineNumber
      });
      optimizations.push('Switch to slim or alpine base images');
    }
    
    if (baseImage.includes('centos') || baseImage.includes('fedora')) {
      issues.push({
        severity: 'medium',
        type: 'Base Image Size',
        description: 'Using heavy base image',
        suggestion: 'Consider alpine or distroless alternatives',
        impact: '~300-500MB reduction',
        lineNumber: inst.lineNumber
      });
    }
    
    // Suggest better alternatives
    if (baseImage.includes('node') && !baseImage.includes('alpine')) {
      issues.push({
        severity: 'medium',
        type: 'Base Image Optimization',
        description: 'Consider using Alpine variant for smaller size',
        suggestion: 'Use node:18-alpine instead of node:18',
        impact: '~200-300MB reduction',
        lineNumber: inst.lineNumber
      });
    }
  });
};

const analyzeRunCommands = (instructions: DockerInstruction[], issues: AnalysisIssue[], optimizations: string[]) => {
  const runInstructions = instructions.filter(inst => inst.instruction === 'RUN');
  
  // Check for multiple RUN commands that could be combined
  if (runInstructions.length > 3) {
    issues.push({
      severity: 'medium',
      type: 'Layer Optimization',
      description: `Found ${runInstructions.length} RUN commands that could be combined`,
      suggestion: 'Combine related RUN commands using && to reduce layers',
      impact: `~${runInstructions.length - 2} layers reduction`
    });
    optimizations.push('Combine multiple RUN commands into single layers');
  }
  
  runInstructions.forEach(inst => {
    const command = inst.args.toLowerCase();
    
    // Check for package manager without cleanup
    if (command.includes('apt-get install') && !command.includes('rm -rf /var/lib/apt/lists/*')) {
      issues.push({
        severity: 'high',
        type: 'Cache Cleanup',
        description: 'apt-get install without cache cleanup',
        suggestion: 'Add && rm -rf /var/lib/apt/lists/* to clean package cache',
        impact: '~50-100MB reduction',
        lineNumber: inst.lineNumber
      });
    }
    
    if (command.includes('yum install') && !command.includes('yum clean all')) {
      issues.push({
        severity: 'high',
        type: 'Cache Cleanup',
        description: 'yum install without cache cleanup',
        suggestion: 'Add && yum clean all to clean package cache',
        impact: '~30-80MB reduction',
        lineNumber: inst.lineNumber
      });
    }
    
    // Check for update commands in separate RUN
    if (command.includes('apt-get update') && !command.includes('install')) {
      issues.push({
        severity: 'medium',
        type: 'Layer Optimization',
        description: 'apt-get update in separate RUN command',
        suggestion: 'Combine apt-get update with install in same RUN command',
        impact: 'Better caching and fewer layers',
        lineNumber: inst.lineNumber
      });
    }
    
    // Check for unnecessary packages
    if (command.includes('curl wget')) {
      issues.push({
        severity: 'low',
        type: 'Package Optimization',
        description: 'Installing both curl and wget',
        suggestion: 'Choose either curl or wget, not both',
        impact: '~10-20MB reduction',
        lineNumber: inst.lineNumber
      });
    }
  });
};

const analyzeCopyCommands = (instructions: DockerInstruction[], issues: AnalysisIssue[], optimizations: string[]) => {
  const copyInstructions = instructions.filter(inst => inst.instruction === 'COPY' || inst.instruction === 'ADD');
  
  copyInstructions.forEach(inst => {
    // Check for copying everything
    if (inst.args.includes('. .') || inst.args.includes('* .')) {
      issues.push({
        severity: 'medium',
        type: 'Copy Optimization',
        description: 'Copying entire context instead of specific files',
        suggestion: 'Copy only necessary files and use .dockerignore',
        impact: 'Reduced context size and better caching',
        lineNumber: inst.lineNumber
      });
      optimizations.push('Use .dockerignore and copy specific files');
    }
    
    // Prefer COPY over ADD
    if (inst.instruction === 'ADD' && !inst.args.includes('http')) {
      issues.push({
        severity: 'low',
        type: 'Best Practices',
        description: 'Using ADD instead of COPY for local files',
        suggestion: 'Use COPY for local files, ADD only for URLs/archives',
        impact: 'Better clarity and security',
        lineNumber: inst.lineNumber
      });
    }
  });
};

const analyzeGeneralPractices = (instructions: DockerInstruction[], issues: AnalysisIssue[], optimizations: string[]) => {
  const hasUser = instructions.some(inst => inst.instruction === 'USER');
  const hasHealthcheck = instructions.some(inst => inst.instruction === 'HEALTHCHECK');
  const hasWorkdir = instructions.some(inst => inst.instruction === 'WORKDIR');
  
  if (!hasUser) {
    issues.push({
      severity: 'high',
      type: 'Security',
      description: 'Running as root user',
      suggestion: 'Add USER instruction to run as non-root user',
      impact: 'Improved security posture'
    });
    optimizations.push('Add non-root user for security');
  }
  
  if (!hasWorkdir) {
    issues.push({
      severity: 'low',
      type: 'Best Practices',
      description: 'No WORKDIR specified',
      suggestion: 'Use WORKDIR to set working directory explicitly',
      impact: 'Better organization and predictability'
    });
  }
  
  // Check for hardcoded secrets or sensitive data
  instructions.forEach(inst => {
    const line = inst.originalLine.toLowerCase();
    if (line.includes('password=') || line.includes('secret=') || line.includes('key=')) {
      issues.push({
        severity: 'high',
        type: 'Security',
        description: 'Hardcoded secrets detected',
        suggestion: 'Use build-time secrets or environment variables',
        impact: 'Improved security',
        lineNumber: inst.lineNumber
      });
    }
  });
};

const countLayers = (instructions: DockerInstruction[]): number => {
  const layerInstructions = ['FROM', 'RUN', 'COPY', 'ADD'];
  return instructions.filter(inst => layerInstructions.includes(inst.instruction)).length;
};

const calculateSecurityScore = (instructions: DockerInstruction[], issues: AnalysisIssue[]): number => {
  let score = 10;
  
  // Deduct points for security issues
  issues.forEach(issue => {
    if (issue.type === 'Security') {
      if (issue.severity === 'high') score -= 2;
      else if (issue.severity === 'medium') score -= 1;
      else score -= 0.5;
    }
  });
  
  return Math.max(score, 0);
};

const estimateSizeReduction = (issues: AnalysisIssue[]): number => {
  let reduction = 0;
  
  issues.forEach(issue => {
    if (issue.impact.includes('MB reduction')) {
      const match = issue.impact.match(/(\d+)-?(\d+)?MB/);
      if (match) {
        const min = parseInt(match[1]);
        const max = match[2] ? parseInt(match[2]) : min;
        reduction += (min + max) / 2;
      }
    }
  });
  
  // Convert to percentage (assuming 1GB base)
  return Math.min(Math.round((reduction / 1000) * 100), 80);
};

export const analyzeDockerImage = (imageName: string): AnalysisResult => {
  // For Docker images, we can only provide general recommendations
  // without access to the actual Dockerfile
  const issues: AnalysisIssue[] = [];
  const optimizations: string[] = [];

  // Add general image optimization suggestions
  issues.push({
    severity: 'medium',
    type: 'Image Analysis',
    description: 'Unable to analyze Dockerfile for this image',
    suggestion: 'For detailed analysis, provide the original Dockerfile',
    impact: 'Limited optimization insights'
  });

  optimizations.push(
    'Use multi-stage builds to reduce final image size',
    'Consider distroless base images for production',
    'Regularly update base images for security patches',
    'Use .dockerignore to exclude unnecessary files'
  );

  return {
    imageName,
    analysisDate: new Date().toISOString(),
    originalSize: 'Unknown',
    optimizedSize: 'N/A',
    sizeReduction: 'N/A',
    securityScore: 6.0,
    layers: 0,
    optimizedLayers: 0,
    issues,
    optimizations,
    hasIssues: false
  };
};
