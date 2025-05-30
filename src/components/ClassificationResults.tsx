
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Box } from 'lucide-react';
import { ClassifierResults } from '@/services/api';
import LoadingSpinner from './LoadingSpinner';

interface ClassificationResultsProps {
  results: ClassifierResults | null;
}

const ClassificationResults = ({ results }: ClassificationResultsProps) => {
  if (!results) {
    return <LoadingSpinner message="Loading classification results..." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {(results.accuracy * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {(results.f1Score * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">F1-Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {(results.precision * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Precision</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {(results.recall * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Recall</div>
            </div>
          </div>
        </CardContent>
      </Card>

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
  );
};

export default ClassificationResults;
