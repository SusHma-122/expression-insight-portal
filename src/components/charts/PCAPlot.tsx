
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { PCAData } from '@/services/api';

interface PCAPlotProps {
  data?: PCAData;
}

const PCAPlot = ({ data }: PCAPlotProps) => {
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
    <Card>
      <CardHeader>
        <CardTitle>PCA Analysis</CardTitle>
        <CardDescription>Sample distribution in principal component space</CardDescription>
      </CardHeader>
      <CardContent>
        {data ? (
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={data.samples}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="pc1"
                  domain={['dataMin', 'dataMax']}
                  label={{ value: `PC1 (${data.variance.pc1}%)`, position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  dataKey="pc2"
                  domain={['dataMin', 'dataMax']}
                  label={{ value: `PC2 (${data.variance.pc2}%)`, angle: -90, position: 'insideLeft' }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name, props) => [
                    `${props.payload.sample}: ${value}`,
                    name
                  ]}
                />
                <Scatter dataKey="pc2">
                  {data.samples.map((entry, index) => (
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
  );
};

export default PCAPlot;
