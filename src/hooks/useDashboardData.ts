
import { useState, useEffect } from 'react';
import { apiService, GeneExpression, ClassifierResults, VolcanoPlotData, HeatmapData, PCAData } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useDashboardData = (selectedDataset: string) => {
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [topGenes, setTopGenes] = useState<GeneExpression[]>([]);
  const [classifierResults, setClassifierResults] = useState<ClassifierResults | null>(null);
  const [volcanoData, setVolcanoData] = useState<VolcanoPlotData | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [pcaData, setPcaData] = useState<PCAData | null>(null);
  const [loading, setLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const { toast } = useToast();

  // Enhanced mock data with user-friendly explanations
  const mockTopGenes: GeneExpression[] = [
    { 
      symbol: 'BRCA1', 
      name: 'Breast Cancer Gene 1', 
      logFC: 2.45, 
      pValue: 0.001, 
      adjPValue: 0.012, 
      expression: [[2.1, 2.3, 1.8, 2.5, 2.0]], 
      description: 'This gene helps repair DNA damage. When it changes, cancer risk increases.'
    },
    { 
      symbol: 'TP53', 
      name: 'Tumor Suppressor Gene', 
      logFC: -1.89, 
      pValue: 0.003, 
      adjPValue: 0.024, 
      expression: [[1.2, 1.5, 1.1, 1.8, 1.3]], 
      description: 'Known as the "guardian of the genome" - it stops cells from becoming cancerous.'
    },
    { 
      symbol: 'ESR1', 
      name: 'Estrogen Receptor', 
      logFC: 3.21, 
      pValue: 0.000, 
      adjPValue: 0.008, 
      expression: [[3.2, 3.5, 2.9, 3.8, 3.1]], 
      description: 'Responds to estrogen hormone. Important in breast cancer treatment decisions.'
    },
    { 
      symbol: 'HER2', 
      name: 'Growth Factor Receptor', 
      logFC: 1.67, 
      pValue: 0.007, 
      adjPValue: 0.045, 
      expression: [[1.7, 1.9, 1.5, 2.1, 1.6]], 
      description: 'Controls cell growth. When overactive, it can cause aggressive cancer.'
    },
    { 
      symbol: 'MYC', 
      name: 'Cell Division Controller', 
      logFC: -2.14, 
      pValue: 0.002, 
      adjPValue: 0.018, 
      expression: [[0.8, 0.9, 0.7, 1.1, 0.9]], 
      description: 'Regulates how fast cells divide. Changes can lead to uncontrolled growth.'
    },
    { 
      symbol: 'PTEN', 
      name: 'Tumor Suppressor', 
      logFC: 1.92, 
      pValue: 0.005, 
      adjPValue: 0.032, 
      expression: [[1.9, 2.1, 1.7, 2.3, 1.8]], 
      description: 'Acts like a brake pedal for cell growth, preventing tumor formation.'
    }
  ];

  const mockClassifierResults: ClassifierResults = {
    accuracy: 0.87,
    precision: 0.84,
    recall: 0.89,
    f1Score: 0.86,
    confusionMatrix: [[45, 7], [6, 42]],
    explanation: 'Our AI correctly predicted the health status 87% of the time by looking at gene patterns. This is quite good for medical predictions!'
  };

  // Check Flask backend connectivity
  const checkBackendConnection = async () => {
    try {
      await apiService.healthCheck();
      setBackendConnected(true);
      console.log('✅ Flask backend is connected and healthy');
    } catch (error) {
      setBackendConnected(false);
      console.log('⚠️ Flask backend not available, using demo data');
    }
  };

  const loadData = async () => {
    if (!selectedDataset) return;

    setLoading(true);
    
    // Check backend first
    await checkBackendConnection();

    try {
      if (backendConnected) {
        // Try to load from Flask backend
        const [genes, classifier] = await Promise.allSettled([
          apiService.getDifferentialGenes(selectedDataset),
          apiService.getClassificationResults(selectedDataset)
        ]);

        if (genes.status === 'fulfilled') {
          setTopGenes(genes.value);
        } else {
          console.log('Using demo gene data - Flask backend gene analysis not ready');
          setTopGenes(mockTopGenes);
        }

        if (classifier.status === 'fulfilled') {
          setClassifierResults(classifier.value);
        } else {
          console.log('Using demo classifier data - Flask backend ML not ready');
          setClassifierResults(mockClassifierResults);
        }

        // Load visualization data
        const [volcano, heatmap, pca] = await Promise.allSettled([
          apiService.getVolcanoPlotData(selectedDataset),
          apiService.getHeatmapData(selectedDataset),
          apiService.getPCAData(selectedDataset)
        ]);

        if (volcano.status === 'fulfilled') setVolcanoData(volcano.value);
        if (heatmap.status === 'fulfilled') setHeatmapData(heatmap.value);
        if (pca.status === 'fulfilled') setPcaData(pca.value);

        toast({
          title: "✅ Connected to Flask Backend",
          description: "Loading real analysis data from your Flask server.",
        });
      } else {
        // Use mock data when Flask is not available
        setTopGenes(mockTopGenes);
        setClassifierResults(mockClassifierResults);
        
        toast({
          title: "📊 Using Demo Data",
          description: "Flask backend not connected. Showing example results for learning.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "⚠️ Data Loading Issue",
        description: "Using demo data for learning. Connect Flask backend for real analysis.",
        variant: "destructive",
      });
      setTopGenes(mockTopGenes);
      setClassifierResults(mockClassifierResults);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    setAnalysisRunning(true);
    
    if (backendConnected) {
      toast({
        title: "🔬 Analysis Started",
        description: "Flask backend is processing your genetic data...",
      });
    } else {
      toast({
        title: "📚 Demo Analysis",
        description: "Simulating analysis with example data for learning...",
      });
    }

    // Simulate processing time
    setTimeout(async () => {
      await loadData();
      setAnalysisRunning(false);
      
      if (backendConnected) {
        toast({
          title: "✅ Analysis Complete",
          description: "Your genetic analysis results are ready to explore!",
        });
      } else {
        toast({
          title: "📖 Demo Complete",
          description: "Explore these example results to learn about genetic analysis!",
        });
      }
    }, backendConnected ? 5000 : 2000); // Longer wait for real Flask processing
  };

  useEffect(() => {
    if (selectedDataset) {
      checkBackendConnection().then(() => {
        loadData();
      });
    }
  }, [selectedDataset]);

  return {
    analysisRunning,
    topGenes,
    classifierResults,
    volcanoData,
    heatmapData,
    pcaData,
    loading,
    backendConnected,
    runAnalysis
  };
};
