
import axios from 'axios';

// Flask backend configuration
const API_BASE_URL = import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased timeout for Flask processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Making request to Flask backend: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and Flask-specific responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Flask response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Flask API error:', error.response?.data || error.message);
    
    // Handle Flask-specific error responses
    if (error.response?.data?.error) {
      console.error('Flask error details:', error.response.data.error);
    }
    
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
  description?: string;
  difficulty?: string;
}

export interface GeneExpression {
  symbol: string;
  name: string;
  logFC: number;
  pValue: number;
  adjPValue: number;
  expression: number[][];
  description?: string; // User-friendly explanation
}

export interface ClassifierResults {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  rocData?: { fpr: number[]; tpr: number[]; auc: number };
  explanation?: string; // Simple explanation of results
}

export interface VolcanoPlotData {
  genes: Array<{
    symbol: string;
    logFC: number;
    negLogPValue: number;
    significant: boolean;
    description?: string;
  }>;
}

export interface HeatmapData {
  genes: string[];
  samples: string[];
  expression: number[][];
  annotations: Record<string, string[]>;
  description?: string;
}

export interface PCAData {
  samples: Array<{
    sample: string;
    pc1: number;
    pc2: number;
    condition: string;
  }>;
  variance: { pc1: number; pc2: number };
  explanation?: string;
}

export const apiService = {
  // Get list of supported datasets from Flask
  getDatasets: async (): Promise<Dataset[]> => {
    try {
      const response = await api.get('/datasets');
      return response.data.datasets || response.data;
    } catch (error) {
      console.error('Error fetching datasets from Flask:', error);
      throw new Error('Failed to fetch datasets from Flask backend');
    }
  },

  // Get dataset summary/metadata from Flask
  getDatasetSummary: async (accessionId: string): Promise<Dataset> => {
    try {
      const response = await api.get(`/dataset/${accessionId}/summary`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dataset ${accessionId} summary from Flask:`, error);
      throw new Error(`Failed to fetch dataset ${accessionId} summary from Flask`);
    }
  },

  // Get top differentially expressed genes from Flask
  getDifferentialGenes: async (accessionId: string): Promise<GeneExpression[]> => {
    try {
      const response = await api.get(`/dataset/${accessionId}/differential-genes`);
      return response.data.genes || response.data;
    } catch (error) {
      console.error(`Error fetching genes for ${accessionId} from Flask:`, error);
      throw new Error(`Failed to fetch genes for ${accessionId} from Flask`);
    }
  },

  // Get single gene expression data from Flask
  getGeneExpression: async (accessionId: string, geneSymbol: string): Promise<GeneExpression> => {
    try {
      const response = await api.get(`/dataset/${accessionId}/gene/${geneSymbol}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching gene ${geneSymbol} from ${accessionId} via Flask:`, error);
      throw new Error(`Failed to fetch gene ${geneSymbol} expression from Flask`);
    }
  },

  // Get ML classification results from Flask
  getClassificationResults: async (accessionId: string): Promise<ClassifierResults> => {
    try {
      const response = await api.get(`/dataset/${accessionId}/classification`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching classification for ${accessionId} from Flask:`, error);
      throw new Error(`Failed to fetch classification results from Flask`);
    }
  },

  // Get volcano plot data from Flask
  getVolcanoPlotData: async (accessionId: string): Promise<VolcanoPlotData> => {
    try {
      const response = await api.get(`/dataset/${accessionId}/volcano-plot`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching volcano plot data for ${accessionId} from Flask:`, error);
      throw new Error(`Failed to fetch volcano plot data from Flask`);
    }
  },

  // Get heatmap data from Flask
  getHeatmapData: async (accessionId: string): Promise<HeatmapData> => {
    try {
      const response = await api.get(`/dataset/${accessionId}/heatmap`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching heatmap data for ${accessionId} from Flask:`, error);
      throw new Error(`Failed to fetch heatmap data from Flask`);
    }
  },

  // Get PCA data from Flask
  getPCAData: async (accessionId: string): Promise<PCAData> => {
    try {
      const response = await api.get(`/dataset/${accessionId}/pca`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching PCA data for ${accessionId} from Flask:`, error);
      throw new Error(`Failed to fetch PCA data from Flask`);
    }
  },

  // Upload user CSV file to Flask
  uploadDataset: async (file: File): Promise<{ datasetId: string; message: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/dataset/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes for file upload
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading dataset to Flask:', error);
      throw new Error('Failed to upload dataset to Flask backend');
    }
  },

  // Health check for Flask backend
  healthCheck: async (): Promise<{ status: string; message: string }> => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Flask backend health check failed:', error);
      throw new Error('Flask backend is not responding');
    }
  },
};
