
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeatmapData } from '@/services/api';

interface ExpressionHeatmapProps {
  data?: HeatmapData;
}

const ExpressionHeatmap = ({ data }: ExpressionHeatmapProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Expression Heatmap</CardTitle>
        <CardDescription>Top differentially expressed genes across samples</CardDescription>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="h-96 overflow-auto">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${data.samples.length + 1}, minmax(0, 1fr))` }}>
              {/* Header row */}
              <div className="font-medium text-xs p-1"></div>
              {data.samples.map((sample, idx) => (
                <div key={idx} className="font-medium text-xs p-1 rotate-45 origin-left">
                  {sample}
                </div>
              ))}
              
              {/* Gene rows */}
              {data.genes.map((gene, geneIdx) => (
                <React.Fragment key={gene}>
                  <div className="font-medium text-xs p-1 bg-gray-50">
                    {gene}
                  </div>
                  {data.expression[geneIdx]?.map((value, sampleIdx) => {
                    const intensity = Math.min(Math.max((value + 3) / 6, 0), 1); // Normalize to 0-1
                    return (
                      <div
                        key={sampleIdx}
                        className="p-1 text-xs text-center"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                          color: intensity > 0.5 ? 'white' : 'black'
                        }}
                        title={`${gene} in ${data.samples[sampleIdx]}: ${value.toFixed(2)}`}
                      >
                        {value.toFixed(1)}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Connect backend to view expression heatmap</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpressionHeatmap;
