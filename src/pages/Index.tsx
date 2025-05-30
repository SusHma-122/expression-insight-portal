
import React, { useState } from 'react';
import { Search, Database, BarChart, Home, FileSearch, Box, Upload, BookOpen, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Dashboard from '@/components/Dashboard';
import GeneSearch from '@/components/GeneSearch';
import DatasetInfo from '@/components/DatasetInfo';
import FileUpload from '@/components/FileUpload';

const datasets = [
  { 
    id: 'GSE42872', 
    title: 'Breast Cancer Study', 
    samples: 104, 
    organism: 'Human',
    description: 'Comparing healthy vs cancer tissue to find important genes',
    difficulty: 'Beginner'
  },
  { 
    id: 'GSE2034', 
    title: 'Cancer Outcome Prediction', 
    samples: 286, 
    organism: 'Human',
    description: 'Predicting if cancer will return after treatment',
    difficulty: 'Intermediate'
  },
  { 
    id: 'GSE7305', 
    title: 'Lung Disease Analysis', 
    samples: 122, 
    organism: 'Human',
    description: 'Understanding lung disease patterns',
    difficulty: 'Beginner'
  },
  { 
    id: 'GSE33126', 
    title: 'Prostate Health Study', 
    samples: 98, 
    organism: 'Human',
    description: 'Analyzing prostate tissue differences',
    difficulty: 'Intermediate'
  },
  { 
    id: 'GSE19804', 
    title: 'Digestive System Cancer', 
    samples: 156, 
    organism: 'Human',
    description: 'Studying colorectal cancer patterns',
    difficulty: 'Advanced'
  }
];

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedDataset, setSelectedDataset] = useState('');

  const handleUploadSuccess = (datasetId: string) => {
    setSelectedDataset(datasetId);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard selectedDataset={selectedDataset} />;
      case 'search':
        return <GeneSearch selectedDataset={selectedDataset} />;
      case 'info':
        return <DatasetInfo selectedDataset={selectedDataset} />;
      case 'upload':
        return <FileUpload onUploadSuccess={handleUploadSuccess} />;
      default:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-3xl border border-blue-100">
              <div className="max-w-5xl mx-auto px-6">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <BookOpen className="w-4 h-4" />
                  Learn About Your Genes
                </div>
                <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Discover What Your 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Genes</span> Tell You
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                  Explore real genetic data from medical studies in simple terms. 
                  No medical background needed - we'll guide you through fascinating discoveries about human health and disease.
                </p>
                
                {/* Key Benefits */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <div className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-blue-200">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-800">5 Real Studies</span>
                  </div>
                  <div className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-green-200">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-800">1000+ Patients</span>
                  </div>
                  <div className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-purple-200">
                    <Box className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-800">AI Analysis</span>
                  </div>
                </div>

                {/* What You'll Learn Section */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mt-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">What You'll Discover</h3>
                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                        🧬
                      </div>
                      <h4 className="font-semibold text-gray-900">Gene Activity</h4>
                      <p className="text-gray-600 text-sm">See which genes are more or less active in different conditions</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                        📊
                      </div>
                      <h4 className="font-semibold text-gray-900">Pattern Recognition</h4>
                      <p className="text-gray-600 text-sm">Find patterns that help predict health outcomes</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                        🔍
                      </div>
                      <h4 className="font-semibold text-gray-900">Individual Genes</h4>
                      <p className="text-gray-600 text-sm">Search for specific genes and understand their role</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dataset Selection */}
            <Card className="max-w-4xl mx-auto shadow-lg border-2 border-blue-100">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                  <Database className="w-6 h-6 text-blue-600" />
                  Choose Your Study
                </CardTitle>
                <CardDescription className="text-lg">
                  Select a medical study to explore. Each study compares different groups of people to find important genetic differences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                  <SelectTrigger className="w-full h-14 text-lg">
                    <SelectValue placeholder="Select a study to begin exploring..." />
                  </SelectTrigger>
                  <SelectContent>
                    {datasets.map((dataset) => (
                      <SelectItem key={dataset.id} value={dataset.id} className="py-4">
                        <div className="flex items-start gap-3 w-full">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{dataset.title}</span>
                              <Badge variant={dataset.difficulty === 'Beginner' ? 'default' : dataset.difficulty === 'Intermediate' ? 'secondary' : 'destructive'} className="text-xs">
                                {dataset.difficulty}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">{dataset.description}</div>
                            <div className="text-xs text-gray-500 mt-1">{dataset.samples} participants</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedDataset && (
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Explore!</h3>
                      <p className="text-blue-700">Choose how you'd like to analyze this study:</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        onClick={() => setCurrentView('dashboard')}
                        className="flex flex-col items-center gap-2 h-auto py-4 bg-blue-600 hover:bg-blue-700"
                      >
                        <BarChart className="w-5 h-5" />
                        <span className="font-medium">Overview</span>
                        <span className="text-xs opacity-90">See the big picture</span>
                      </Button>
                      <Button
                        onClick={() => setCurrentView('search')}
                        variant="outline"
                        className="flex flex-col items-center gap-2 h-auto py-4 border-blue-200 hover:bg-blue-50"
                      >
                        <Search className="w-5 h-5" />
                        <span className="font-medium">Gene Search</span>
                        <span className="text-xs opacity-70">Find specific genes</span>
                      </Button>
                      <Button
                        onClick={() => setCurrentView('info')}
                        variant="outline"
                        className="flex flex-col items-center gap-2 h-auto py-4 border-blue-200 hover:bg-blue-50"
                      >
                        <FileSearch className="w-5 h-5" />
                        <span className="font-medium">Study Details</span>
                        <span className="text-xs opacity-70">Learn about the data</span>
                      </Button>
                    </div>
                  </div>
                )}

                <div className="text-center py-6 border-t border-gray-200">
                  <p className="text-gray-600 mb-4">Have your own genetic data?</p>
                  <Button
                    onClick={() => setCurrentView('upload')}
                    variant="outline"
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Your Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BarChart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Compare Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    See how gene activity differs between healthy people and those with diseases. 
                    Discover which genes might be important for health.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-200 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Box className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">AI Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Use artificial intelligence to predict health outcomes based on genetic patterns. 
                    See how accurate these predictions can be.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Explore Genes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Search for any gene and see how it behaves in different conditions. 
                    Learn what each gene does in simple terms.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">Gene Explorer</span>
                <div className="text-xs text-gray-500">Discover Your Genetic Story</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
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
                    Overview
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
              <Button
                variant={currentView === 'upload' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('upload')}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
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
