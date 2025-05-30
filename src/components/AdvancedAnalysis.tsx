
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Box, FileSearch } from 'lucide-react';

const AdvancedAnalysis = () => {
  return (
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
  );
};

export default AdvancedAnalysis;
