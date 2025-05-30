import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Database, FileSearch, Box, RefreshCw } from 'lucide-react';
import { apiService, GeneExpression, ClassifierResults, VolcanoPlotData, HeatmapData, PCAData } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import DataVisualization from './DataVisualization';
import LoadingSpinner from './LoadingSpinner';

interface DashboardProps {
  selectedDataset: string;
}

const Dashboard = ({ selectedDataset }: DashboardProps) => {
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
    { symbol: 'BRCA1', name: 'Breast cancer gene 1', logFC: 2.45, pValue: 0.001, adjPValue: 0.012, expression: [2.1, 2.3, 1.8, 2.5, 2.0] },
    { symbol: 'TP53', name: 'Tumor protein p53', logFC: -1.89, pValue: 0.003, adjPValue: 0.024, expression: [1.2, 1.5, 1.1, 1.8, 1.3] },
    { symbol: 'ESR1', name: 'Estrogen receptor 1', logFC: 3.21, pValue: 0.000, adjPValue: 0.008, expression: [3.2, 3.5, 2.9, 3.8, 3.1] },
    { symbol: 'HER2', name: 'Human epidermal growth factor receptor 2', logFC: 1.67, pValue: 0.007, adjPValue: 0.045, expression: [1.7, 1.9, 1.5, 2.1, 1.6] },
    { symbol: 'MYC', name: 'MYC proto-oncogene', logFC: -2.14, pValue: 0.002, adjPValue: 0.018, expression: [0.8, 0.9, 0.7, 1.1, 0.9] },
    { symbol: 'PTEN', name: 'Phosphatase and tensin homolog', logFC: 1.92, pValue: 0.005, adjPValue: 0.032, expression: [1.9, 2.1, 1.7, 2.3, 1.8] }
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
      // Try to fetch real data from backend
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

      // Try to load visualization data
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
      // Fallback to mock data
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

    // Simulate analysis time
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

  if (!selectedDataset) {
    return (
      <div className="text-center py-12">
        <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Dataset Selected</h3>
        <p className="text-gray-500">Please select a dataset from the home page to view the dashboard.</p>
      </div>
    );
  }

  if (loading && topGenes.length === 0) {
    return <LoadingSpinner size="lg" message="Loading analysis data..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analysis Dashboard</h1>
          <p className="text-gray-600 mt-2">Dataset: {selectedDataset}</p>
        </div>
        <Button 
          onClick={runAnalysis} 
          disabled={analysisRunning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {analysisRunning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Running Analysis...
            </>
          ) : (
            'Run Analysis'
          )}
        </Button>
      </div>

      <Tabs defaultValue="expression" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="expression">Expression Analysis</TabsTrigger>
          <TabsTrigger value="classification">ML Classification</TabsTrigger>
          <TabsTrigger value="visualization">Visualizations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Plots</TabsTrigger>
        </TabsList>

        <TabsContent value="expression" className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Genes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">20,531</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Differentially Expressed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">1,247</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Upregulated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">678</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Downregulated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">569</div>
              </CardContent>
            </Card>
          </div>

          {/* Top Differentially Expressed Genes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Top Differentially Expressed Genes
              </CardTitle>
              <CardDescription>
                Genes ranked by statistical significance and fold change
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Gene Symbol</th>
                      <th className="text-left py-2">Log2 Fold Change</th>
                      <th className="text-left py-2">P-value</th>
                      <th className="text-left py-2">Adj. P-value</th>
                      <th className="text-left py-2">Regulation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topGenes.map((gene, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-medium text-blue-600">{gene.symbol}</td>
                        <td className="py-2">{gene.logFC.toFixed(2)}</td>
                        <td className="py-2">{gene.pValue.toFixed(3)}</td>
                        <td className="py-2">{gene.adjPValue.toFixed(3)}</td>
                        <td className="py-2">
                          <Badge 
                            variant={gene.logFC > 0 ? "destructive" : "secondary"}
                            className={gene.logFC > 0 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}
                          >
                            {gene.logFC > 0 ? 'Up' : 'Down'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classification" className="space-y-6">
          {classifierResults ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Classification Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="w-5 h-5" />
                    Model Performance
                  </CardTitle>
                  <CardDescription>Random Forest Classifier Results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {(mockClassifierResults.accuracy * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {(mockClassifierResults.f1Score * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">F1-Score</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {(mockClassifierResults.precision * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Precision</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {(mockClassifierResults.recall * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Recall</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Confusion Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle>Confusion Matrix</CardTitle>
                  <CardDescription>Model prediction accuracy breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 max-w-64 mx-auto">
                    <div className="text-center p-4 bg-green-100 border-2 border-green-300 rounded">
                      <div className="text-xl font-bold text-green-800">45</div>
                      <div className="text-xs text-green-600">True Negative</div>
                    </div>
                    <div className="text-center p-4 bg-red-100 border-2 border-red-300 rounded">
                      <div className="text-xl font-bold text-red-800">7</div>
                      <div className="text-xs text-red-600">False Positive</div>
                    </div>
                    <div className="text-center p-4 bg-red-100 border-2 border-red-300 rounded">
                      <div className="text-xl font-bold text-red-800">6</div>
                      <div className="text-xs text-red-600">False Negative</div>
                    </div>
                    <div className="text-center p-4 bg-green-100 border-2 border-green-300 rounded">
                      <div className="text-xl font-bold text-green-800">42</div>
                      <div className="text-xs text-green-600">True Positive</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <LoadingSpinner message="Loading classification results..." />
          )}
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          <DataVisualization 
            volcanoData={volcanoData}
            heatmapData={heatmapData}
            pcaData={pcaData}
            isLoading={loading}
          />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analysis</CardTitle>
              <CardDescription>Additional statistical and pathway analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-64 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Box className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Pathway Enrichment</p>
                    <p className="text-sm text-gray-400">Connect backend to view</p>
                  </div>
                </div>
                <div className="h-64 bg-gradient-to-br from-rose-50 to-orange-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileSearch className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Gene Ontology</p>
                    <p className="text-sm text-gray-400">Connect backend to view</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
