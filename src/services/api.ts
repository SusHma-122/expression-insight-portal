import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for long operations
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface Dataset {
  id: string;
  title: string;
  samples: number;
  organism: string;
  diseases?: string[];
  submissionDate?: string;
  lastUpdate?: string;
}

export interface GeneExpression {
  symbol: string;
  name: string;
  logFC: number;
  pValue: number;
  adjPValue: number;
  expression: number[][];
}

export interface ClassifierResults {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  rocData?: { fpr: number[]; tpr: number[]; auc: number };
}

export interface VolcanoPlotData {
  genes: Array<{
    symbol: string;
    logFC: number;
    negLogPValue: number;
    significant: boolean;
  }>;
}

export interface HeatmapData {
  genes: string[];
  samples: string[];
  expression: number[][];
  annotations: Record<string, string[]>;
}

export interface PCAData {
  samples: Array<{
    sample: string;
    pc1: number;
    pc2: number;
    condition: string;
  }>;
  variance: { pc1: number; pc2: number };
}

export const apiService = {
  // Get list of supported datasets
  getDatasets: async (): Promise<Dataset[]> => {
    try {
      const response = await api.get('/datasets');
      return response.data;
    } catch (error) {
      console.error('Error fetching datasets:', error);
      throw new Error('Failed to fetch datasets');
    }
  },

  // Get dataset summary/metadata
  getDatasetSummary: async (accessionId: string): Promise<Dataset> => {
    try {
      const response = await api.get(`/dataset/${accessionId}/summary`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dataset ${accessionId} summary:`, error);
      throw new Error(`Failed to fetch dataset ${accessionId} summary`);
    }
  },

  // Get top differentially expressed genes
  getDifferentialGenes: async (accessionId: string): Promise<GeneExpression[]> => {
    try {
      const response = await api.get(`/dataset/${accessionId}/genes`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching genes for ${accessionId}:`, error);
      throw new Error(`Failed to fetch genes for ${accessionId}`);
    }
  },

  // Get single gene expression data
  getGeneExpression: async (accessionId: string, geneSymbol: string): Promise<GeneExpression> => {
    try {
      const response = await api.get(`/gene/${accessionId}/${geneSymbol}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching gene ${geneSymbol} from ${accessionId}:`, error);
      throw new Error(`Failed to fetch gene ${geneSymbol} expression`);
    }
  },

  // Get ML classification results
  getClassificationResults: async (accessionId: string): Promise<ClassifierResults> => {
    try {
      const response = await api.get(`/dataset/${accessionId}/classify`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching classification for ${accessionId}:`, error);
      throw new Error(`Failed to fetch classification results`);
    }
  },

  // Get volcano plot data
  getVolcanoPlotData: async (accessionId: string): Promise<VolcanoPlotData> => {
    try {
      const response = await api.get(`/dataset/${accessionId}/volcano`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching volcano plot data for ${accessionId}:`, error);
      throw new Error(`Failed to fetch volcano plot data`);
    }
  },

  // Get heatmap data
  getHeatmapData: async (accessionId: string): Promise<HeatmapData> => {
    try {
      const response = await api.get(`/dataset/${accessionId}/heatmap`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching heatmap data for ${accessionId}:`, error);
      throw new Error(`Failed to fetch heatmap data`);
    }
  },

  // Get PCA data
  getPCAData: async (accessionId: string): Promise<PCAData> => {
    try {
      const response = await api.get(`/dataset/${accessionId}/pca`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching PCA data for ${accessionId}:`, error);
      throw new Error(`Failed to fetch PCA data`);
    }
  },

  // Upload user CSV file
  uploadDataset: async (file: File): Promise<{ datasetId: string; message: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/dataset/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading dataset:', error);
      throw new Error('Failed to upload dataset');
    }
  },
};
