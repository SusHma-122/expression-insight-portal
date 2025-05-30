
import React, { useState } from 'react';
import { Search, Database, BarChart, Home, FileSearch, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Dashboard from '@/components/Dashboard';
import GeneSearch from '@/components/GeneSearch';
import DatasetInfo from '@/components/DatasetInfo';

const datasets = [
  { id: 'GSE42872', title: 'Breast Cancer Expression', samples: 104, organism: 'Homo sapiens' },
  { id: 'GSE2034', title: 'Breast Cancer Outcome', samples: 286, organism: 'Homo sapiens' },
  { id: 'GSE7305', title: 'Lung Cancer Analysis', samples: 122, organism: 'Homo sapiens' },
  { id: 'GSE33126', title: 'Prostate Cancer Study', samples: 98, organism: 'Homo sapiens' },
  { id: 'GSE19804', title: 'Colorectal Cancer', samples: 156, organism: 'Homo sapiens' },
  { id: 'GSE6344', title: 'Leukemia Expression', samples: 89, organism: 'Homo sapiens' },
  { id: 'GSE10072', title: 'Liver Cancer Dataset', samples: 145, organism: 'Homo sapiens' },
  { id: 'GSE29172', title: 'Ovarian Cancer Study', samples: 78, organism: 'Homo sapiens' },
  { id: 'GSE14827', title: 'Kidney Cancer Analysis', samples: 134, organism: 'Homo sapiens' },
  { id: 'GSE12417', title: 'Brain Tumor Expression', samples: 67, organism: 'Homo sapiens' }
];

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedDataset, setSelectedDataset] = useState('');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard selectedDataset={selectedDataset} />;
      case 'search':
        return <GeneSearch selectedDataset={selectedDataset} />;
      case 'info':
        return <DatasetInfo selectedDataset={selectedDataset} />;
      default:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
              <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">
                  Gene Expression Explorer
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Analyze gene expression data from NCBI GEO repository with advanced 
                  differential expression analysis and machine learning classification
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    🧬 10 Curated Datasets
                  </span>
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    📊 ML Classification
                  </span>
                  <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    🔬 Differential Analysis
                  </span>
                </div>
              </div>
            </div>

            {/* Dataset Selection */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Select Dataset
                </CardTitle>
                <CardDescription>
                  Choose a gene expression dataset to begin analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a dataset..." />
                  </SelectTrigger>
                  <SelectContent>
                    {datasets.map((dataset) => (
                      <SelectItem key={dataset.id} value={dataset.id}>
                        {dataset.id} - {dataset.title} ({dataset.samples} samples)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedDataset && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Button
                      onClick={() => setCurrentView('dashboard')}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <BarChart className="w-4 h-4" />
                      Dashboard
                    </Button>
                    <Button
                      onClick={() => setCurrentView('search')}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Gene Search
                    </Button>
                    <Button
                      onClick={() => setCurrentView('info')}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FileSearch className="w-4 h-4" />
                      Dataset Info
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart className="w-5 h-5 text-blue-600" />
                    Expression Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Perform differential gene expression analysis with statistical testing and fold change calculations.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Box className="w-5 h-5 text-green-600" />
                    ML Classification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Train machine learning models to predict disease status from gene expression profiles.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Search className="w-5 h-5 text-purple-600" />
                    Gene Exploration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Search and visualize individual gene expression patterns across different conditions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GE</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Gene Expression Explorer</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant={currentView === 'home' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              {selectedDataset && (
                <>
                  <Button
                    variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                    onClick={() => setCurrentView('dashboard')}
                    className="flex items-center gap-2"
                  >
                    <BarChart className="w-4 h-4" />
                    Dashboard
                  </Button>
                  <Button
                    variant={currentView === 'search' ? 'default' : 'ghost'}
                    onClick={() => setCurrentView('search')}
                    className="flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
