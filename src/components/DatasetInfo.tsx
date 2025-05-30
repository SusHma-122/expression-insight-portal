
import React from 'react';
import { Database, FileSearch, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DatasetInfoProps {
  selectedDataset: string;
}

const DatasetInfo = ({ selectedDataset }: DatasetInfoProps) => {
  // Mock dataset information
  const datasetDetails = {
    'GSE42872': {
      title: 'Breast Cancer Expression Analysis',
      description: 'Gene expression profiling of breast cancer samples to identify molecular subtypes and therapeutic targets.',
      samples: 104,
      organism: 'Homo sapiens',
      platform: 'Affymetrix Human Genome U133A 2.0 Array',
      diseases: ['Breast Cancer', 'Control'],
      submissionDate: '2012-12-03',
      lastUpdate: '2013-01-15',
      contributors: ['Smith, J.', 'Johnson, A.', 'Brown, K.'],
      publication: 'Nature Medicine 2013'
    },
    'GSE2034': {
      title: 'Breast Cancer Outcome Prediction',
      description: 'Expression profiles for predicting patient outcome in node-negative breast cancer.',
      samples: 286,
      organism: 'Homo sapiens',
      platform: 'Affymetrix Human Genome U133A Array',
      diseases: ['Breast Cancer', 'Recurrence', 'Non-recurrence'],
      submissionDate: '2005-03-15',
      lastUpdate: '2005-06-20',
      contributors: ['Wang, Y.', 'Klijn, J.G.', 'Zhang, Y.'],
      publication: 'The Lancet 2005'
    }
  };

  const defaultInfo = {
    title: 'Dataset Information',
    description: 'Detailed information about the selected gene expression dataset.',
    samples: 100,
    organism: 'Homo sapiens',
    platform: 'Affymetrix Array',
    diseases: ['Cancer', 'Control'],
    submissionDate: '2020-01-01',
    lastUpdate: '2020-06-01',
    contributors: ['Research Team'],
    publication: 'Scientific Journal 2020'
  };

  const info = datasetDetails[selectedDataset as keyof typeof datasetDetails] || defaultInfo;

  if (!selectedDataset) {
    return (
      <div className="text-center py-12">
        <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Dataset Selected</h3>
        <p className="text-gray-500">Please select a dataset to view detailed information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dataset Information</h1>
        <p className="text-gray-600 mt-2">Detailed metadata and characteristics for {selectedDataset}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="w-5 h-5" />
                {selectedDataset} - {info.title}
              </CardTitle>
              <CardDescription>{info.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Samples</label>
                  <div className="text-xl font-bold text-blue-600">{info.samples}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Organism</label>
                  <div className="text-xl font-bold text-green-600">{info.organism}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Submission Date</label>
                  <div className="text-lg">{info.submissionDate}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Update</label>
                  <div className="text-lg">{info.lastUpdate}</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Platform</label>
                <div className="text-lg mt-1">{info.platform}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Publication</label>
                <div className="text-lg mt-1 text-blue-600">{info.publication}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sample Distribution</CardTitle>
              <CardDescription>Breakdown of samples by condition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {info.diseases.map((disease, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{disease}</span>
                    <Badge variant="outline">
                      {Math.floor(info.samples / info.diseases.length)} samples
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{info.samples}</div>
                <div className="text-sm text-gray-600">Total Samples</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">20,531</div>
                <div className="text-sm text-gray-600">Total Probes</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{info.diseases.length}</div>
                <div className="text-sm text-gray-600">Conditions</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {info.contributors.map((contributor, index) => (
                  <div key={index} className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                    {contributor}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disease Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {info.diseases.map((disease, index) => (
                  <Badge key={index} variant="secondary">
                    {disease}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DatasetInfo;
