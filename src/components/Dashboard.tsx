
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, RefreshCw } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import DataVisualization from './DataVisualization';
import LoadingSpinner from './LoadingSpinner';
import DashboardStats from './DashboardStats';
import GeneExpressionTable from './GeneExpressionTable';
import ClassificationResults from './ClassificationResults';
import AdvancedAnalysis from './AdvancedAnalysis';

interface DashboardProps {
  selectedDataset: string;
}

const Dashboard = ({ selectedDataset }: DashboardProps) => {
  const {
    analysisRunning,
    topGenes,
    classifierResults,
    volcanoData,
    heatmapData,
    pcaData,
    loading,
    runAnalysis
  } = useDashboardData(selectedDataset);

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
          <DashboardStats />
          <GeneExpressionTable genes={topGenes} />
        </TabsContent>

        <TabsContent value="classification" className="space-y-6">
          <ClassificationResults results={classifierResults} />
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
          <AdvancedAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
