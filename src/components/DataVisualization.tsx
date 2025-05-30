
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { VolcanoPlotData, HeatmapData, PCAData } from '@/services/api';

interface DataVisualizationProps {
  volcanoData?: VolcanoPlotData;
  heatmapData?: HeatmapData;
  pcaData?: PCAData;
  isLoading?: boolean;
}

const DataVisualization = ({ volcanoData, heatmapData, pcaData, isLoading }: DataVisualizationProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const chartConfig = {
    expression: {
      label: "Expression",
      color: "#3b82f6",
    },
    significant: {
      label: "Significant",
      color: "#ef4444",
    },
    nonsignificant: {
      label: "Non-significant",
      color: "#6b7280",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Volcano Plot */}
      <Card>
        <CardHeader>
          <CardTitle>Volcano Plot</CardTitle>
          <CardDescription>Statistical significance vs fold change</CardDescription>
        </CardHeader>
        <CardContent>
          {volcanoData ? (
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={volcanoData.genes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="logFC" 
                    domain={['dataMin', 'dataMax']}
                    label={{ value: 'Log2 Fold Change', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="negLogPValue"
                    label={{ value: '-Log10 P-value', angle: -90, position: 'insideLeft' }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value, name, props) => [
                      `${props.payload.symbol}: ${value}`,
                      name === 'logFC' ? 'Log2 FC' : '-Log10 P'
                    ]}
                  />
                  <Scatter dataKey="negLogPValue">
                    {volcanoData.genes.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.significant ? chartConfig.significant.color : chartConfig.nonsignificant.color}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Connect backend to view volcano plot</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PCA Plot */}
      <Card>
        <CardHeader>
          <CardTitle>PCA Analysis</CardTitle>
          <CardDescription>Sample distribution in principal component space</CardDescription>
        </CardHeader>
        <CardContent>
          {pcaData ? (
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={pcaData.samples}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="pc1"
                    domain={['dataMin', 'dataMax']}
                    label={{ value: `PC1 (${pcaData.variance.pc1}%)`, position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="pc2"
                    domain={['dataMin', 'dataMax']}
                    label={{ value: `PC2 (${pcaData.variance.pc2}%)`, angle: -90, position: 'insideLeft' }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value, name, props) => [
                      `${props.payload.sample}: ${value}`,
                      name
                    ]}
                  />
                  <Scatter dataKey="pc2">
                    {pcaData.samples.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.condition === 'disease' ? chartConfig.significant.color : chartConfig.expression.color}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Connect backend to view PCA analysis</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expression Heatmap */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Expression Heatmap</CardTitle>
          <CardDescription>Top differentially expressed genes across samples</CardDescription>
        </CardHeader>
        <CardContent>
          {heatmapData ? (
            <div className="h-96 overflow-auto">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${heatmapData.samples.length + 1}, minmax(0, 1fr))` }}>
                {/* Header row */}
                <div className="font-medium text-xs p-1"></div>
                {heatmapData.samples.map((sample, idx) => (
                  <div key={idx} className="font-medium text-xs p-1 rotate-45 origin-left">
                    {sample}
                  </div>
                ))}
                
                {/* Gene rows */}
                {heatmapData.genes.map((gene, geneIdx) => (
                  <React.Fragment key={gene}>
                    <div className="font-medium text-xs p-1 bg-gray-50">
                      {gene}
                    </div>
                    {heatmapData.expression[geneIdx]?.map((value, sampleIdx) => {
                      const intensity = Math.min(Math.max((value + 3) / 6, 0), 1); // Normalize to 0-1
                      return (
                        <div
                          key={sampleIdx}
                          className="p-1 text-xs text-center"
                          style={{
                            backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                            color: intensity > 0.5 ? 'white' : 'black'
                          }}
                          title={`${gene} in ${heatmapData.samples[sampleIdx]}: ${value.toFixed(2)}`}
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
    </div>
  );
};

export default DataVisualization;
