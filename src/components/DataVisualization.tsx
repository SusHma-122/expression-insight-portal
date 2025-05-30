
import React from 'react';
import { VolcanoPlotData, HeatmapData, PCAData } from '@/services/api';
import VolcanoPlot from './charts/VolcanoPlot';
import PCAPlot from './charts/PCAPlot';
import ExpressionHeatmap from './charts/ExpressionHeatmap';
import ChartLoadingSkeleton from './charts/ChartLoadingSkeleton';

interface DataVisualizationProps {
  volcanoData?: VolcanoPlotData;
  heatmapData?: HeatmapData;
  pcaData?: PCAData;
  isLoading?: boolean;
}

const DataVisualization = ({ volcanoData, heatmapData, pcaData, isLoading }: DataVisualizationProps) => {
  if (isLoading) {
    return <ChartLoadingSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <VolcanoPlot data={volcanoData} />
      <PCAPlot data={pcaData} />
      <ExpressionHeatmap data={heatmapData} />
    </div>
  );
};

export default DataVisualization;
