
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, RefreshCw, Wifi, WifiOff, Info } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
    backendConnected,
    runAnalysis
  } = useDashboardData(selectedDataset);

  if (!selectedDataset) {
    return (
      <div className="text-center py-12">
        <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Study Selected</h3>
        <p className="text-gray-500">Please go back and choose a genetic study to explore.</p>
      </div>
    );
  }

  if (loading && topGenes.length === 0) {
    return <LoadingSpinner size="lg" message="Loading your genetic analysis..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Backend Status */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Genetic Analysis</h1>
          <p className="text-gray-600 mt-2">Study: {selectedDataset}</p>
          
          {/* Backend Connection Status */}
          <div className="flex items-center gap-2 mt-3">
            {backendConnected ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Flask Backend Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Demo Mode</span>
              </div>
            )}
          </div>
        </div>
        
        <Button 
          onClick={runAnalysis} 
          disabled={analysisRunning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {analysisRunning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              {backendConnected ? 'Analyzing...' : 'Simulating...'}
            </>
          ) : (
            backendConnected ? 'Run Real Analysis' : 'Try Demo Analysis'
          )}
        </Button>
      </div>

      {/* Info Alert */}
      {!backendConnected && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Learning Mode:</strong> You're viewing example data to understand genetic analysis. 
            Connect your Flask backend to analyze real genetic datasets.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="expression" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="expression">🧬 Gene Activity</TabsTrigger>
          <TabsTrigger value="classification">🤖 AI Predictions</TabsTrigger>
          <TabsTrigger value="visualization">📊 Visual Analysis</TabsTrigger>
          <TabsTrigger value="advanced">🔬 Advanced Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="expression" className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Understanding Gene Activity</h3>
            <p className="text-blue-800 text-sm">
              This shows which genes are more or less active in diseased vs healthy tissue. 
              Higher numbers mean the gene is more active, negative numbers mean less active.
            </p>
          </div>
          <DashboardStats />
          <GeneExpressionTable genes={topGenes} />
        </TabsContent>

        <TabsContent value="classification" className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">AI Health Predictions</h3>
            <p className="text-green-800 text-sm">
              Our artificial intelligence looks at gene patterns to predict health status. 
              See how accurately it can distinguish between healthy and diseased samples.
            </p>
          </div>
          <ClassificationResults results={classifierResults} />
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">Visual Gene Analysis</h3>
            <p className="text-purple-800 text-sm">
              These charts help you see patterns in the genetic data. Each dot or color represents 
              different genes or samples, making it easier to spot important differences.
            </p>
          </div>
          <DataVisualization 
            volcanoData={volcanoData}
            heatmapData={heatmapData}
            pcaData={pcaData}
            isLoading={loading}
          />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-2">Advanced Analysis</h3>
            <p className="text-orange-800 text-sm">
              Explore more sophisticated analysis methods used by researchers to understand 
              complex genetic relationships and disease mechanisms.
            </p>
          </div>
          <AdvancedAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
