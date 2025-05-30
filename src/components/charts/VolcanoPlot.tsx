
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { VolcanoPlotData } from '@/services/api';

interface VolcanoPlotProps {
  data?: VolcanoPlotData;
}

const VolcanoPlot = ({ data }: VolcanoPlotProps) => {
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
        <CardTitle>Volcano Plot</CardTitle>
        <CardDescription>Statistical significance vs fold change</CardDescription>
      </CardHeader>
      <CardContent>
        {data ? (
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={data.genes}>
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
                  {data.genes.map((entry, index) => (
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
  );
};

export default VolcanoPlot;
