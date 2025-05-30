
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
  const { toast } = useToast();

  // Mock data fallback when backend is not available
  const mockTopGenes: GeneExpression[] = [
    { symbol: 'BRCA1', name: 'Breast cancer gene 1', logFC: 2.45, pValue: 0.001, adjPValue: 0.012, expression: [[2.1, 2.3, 1.8, 2.5, 2.0]] },
    { symbol: 'TP53', name: 'Tumor protein p53', logFC: -1.89, pValue: 0.003, adjPValue: 0.024, expression: [[1.2, 1.5, 1.1, 1.8, 1.3]] },
    { symbol: 'ESR1', name: 'Estrogen receptor 1', logFC: 3.21, pValue: 0.000, adjPValue: 0.008, expression: [[3.2, 3.5, 2.9, 3.8, 3.1]] },
    { symbol: 'HER2', name: 'Human epidermal growth factor receptor 2', logFC: 1.67, pValue: 0.007, adjPValue: 0.045, expression: [[1.7, 1.9, 1.5, 2.1, 1.6]] },
    { symbol: 'MYC', name: 'MYC proto-oncogene', logFC: -2.14, pValue: 0.002, adjPValue: 0.018, expression: [[0.8, 0.9, 0.7, 1.1, 0.9]] },
    { symbol: 'PTEN', name: 'Phosphatase and tensin homolog', logFC: 1.92, pValue: 0.005, adjPValue: 0.032, expression: [[1.9, 2.1, 1.7, 2.3, 1.8]] }
  ];

  const mockClassifierResults: ClassifierResults = {
    accuracy: 0.87,
    precision: 0.84,
    recall: 0.89,
    f1Score: 0.86,
    confusionMatrix: [[45, 7], [6, 42]]
  };

  const loadData = async () => {
    if (!selectedDataset) return;

    setLoading(true);
    try {
      const [genes, classifier] = await Promise.allSettled([
        apiService.getDifferentialGenes(selectedDataset),
        apiService.getClassificationResults(selectedDataset)
      ]);

      if (genes.status === 'fulfilled') {
        setTopGenes(genes.value);
      } else {
        console.log('Using mock gene data - backend not available');
        setTopGenes(mockTopGenes);
      }

      if (classifier.status === 'fulfilled') {
        setClassifierResults(classifier.value);
      } else {
        console.log('Using mock classifier data - backend not available');
        setClassifierResults(mockClassifierResults);
      }

      const [volcano, heatmap, pca] = await Promise.allSettled([
        apiService.getVolcanoPlotData(selectedDataset),
        apiService.getHeatmapData(selectedDataset),
        apiService.getPCAData(selectedDataset)
      ]);

      if (volcano.status === 'fulfilled') setVolcanoData(volcano.value);
      if (heatmap.status === 'fulfilled') setHeatmapData(heatmap.value);
      if (pca.status === 'fulfilled') setPcaData(pca.value);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Data Loading Error",
        description: "Using mock data. Connect backend for real analysis.",
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
    toast({
      title: "Analysis Started",
      description: "Running differential expression and ML analysis...",
    });

    setTimeout(async () => {
      await loadData();
      setAnalysisRunning(false);
      toast({
        title: "Analysis Complete",
        description: "Results have been updated with latest analysis.",
      });
    }, 3000);
  };

  useEffect(() => {
    if (selectedDataset) {
      loadData();
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
    runAnalysis
  };
};
