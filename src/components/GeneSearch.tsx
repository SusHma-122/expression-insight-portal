
import React, { useState } from 'react';
import { Search, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GeneSearchProps {
  selectedDataset: string;
}

const GeneSearch = ({ selectedDataset }: GeneSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedGene, setSelectedGene] = useState<string | null>(null);

  // Mock gene data
  const mockGenes = [
    { symbol: 'BRCA1', name: 'Breast cancer gene 1', expression: [2.1, 2.3, 1.8, 2.5, 2.0], pValue: 0.001 },
    { symbol: 'TP53', name: 'Tumor protein p53', expression: [1.2, 1.5, 1.1, 1.8, 1.3], pValue: 0.003 },
    { symbol: 'ESR1', name: 'Estrogen receptor 1', expression: [3.2, 3.5, 2.9, 3.8, 3.1], pValue: 0.000 },
    { symbol: 'HER2', name: 'Human epidermal growth factor receptor 2', expression: [1.7, 1.9, 1.5, 2.1, 1.6], pValue: 0.007 },
    { symbol: 'MYC', name: 'MYC proto-oncogene', expression: [0.8, 0.9, 0.7, 1.1, 0.9], pValue: 0.002 },
    { symbol: 'PTEN', name: 'Phosphatase and tensin homolog', expression: [1.9, 2.1, 1.7, 2.3, 1.8], pValue: 0.005 }
  ];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const results = mockGenes.filter(gene => 
        gene.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gene.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const selectGene = (geneSymbol: string) => {
    setSelectedGene(geneSymbol);
  };

  const selectedGeneData = mockGenes.find(gene => gene.symbol === selectedGene);

  if (!selectedDataset) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Dataset Selected</h3>
        <p className="text-gray-500">Please select a dataset to search for genes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gene Search</h1>
        <p className="text-gray-600 mt-2">Search and explore individual gene expression patterns in {selectedDataset}</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Gene Search
          </CardTitle>
          <CardDescription>
            Enter a gene symbol or name to search for expression data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., BRCA1, TP53, ESR1..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Found {searchResults.length} matching genes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {searchResults.map((gene, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => selectGene(gene.symbol)}
                >
                  <div>
                    <div className="font-medium text-blue-600">{gene.symbol}</div>
                    <div className="text-sm text-gray-600">{gene.name}</div>
                  </div>
                  <Badge variant="outline">
                    p = {gene.pValue.toFixed(3)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gene Expression Details */}
      {selectedGeneData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                {selectedGeneData.symbol} Expression
              </CardTitle>
              <CardDescription>{selectedGeneData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">Mean Expression</div>
                    <div className="text-xl font-bold text-blue-600">
                      {(selectedGeneData.expression.reduce((a, b) => a + b, 0) / selectedGeneData.expression.length).toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600">P-value</div>
                    <div className="text-xl font-bold text-green-600">
                      {selectedGeneData.pValue.toFixed(3)}
                    </div>
                  </div>
                </div>
                
                {/* Simple bar chart visualization */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Expression Levels by Sample</div>
                  {selectedGeneData.expression.map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-16">Sample {index + 1}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-blue-500 h-4 rounded-full transition-all"
                          style={{ width: `${(value / Math.max(...selectedGeneData.expression)) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">{value.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Box Plot Visualization</CardTitle>
              <CardDescription>Expression distribution across conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive box plot</p>
                  <p className="text-sm text-gray-400">Connect backend for detailed visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Gene Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Common cancer-related genes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['BRCA1', 'TP53', 'ESR1', 'HER2', 'MYC', 'PTEN'].map((gene) => (
              <Button
                key={gene}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm(gene);
                  setSearchResults(mockGenes.filter(g => g.symbol === gene));
                  selectGene(gene);
                }}
                className="hover:bg-blue-50"
              >
                {gene}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneSearch;
