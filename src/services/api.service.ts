/**
 * API Service
 * Centralized API communication layer
 */

import axios, { AxiosInstance } from "axios";
import API_BASE_URL, { API_ENDPOINTS } from "@/config/api";
import { FileType } from "@/types";

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Upload file and run a specific validation task
   */
  async runValidationTask(
    file: File,
    taskKey: string,
    fileType: FileType
  ): Promise<Record<string, unknown>> {
    try {
      const endpoint = this.getEndpoint(taskKey, fileType);
      const formData = new FormData();
      formData.append("file", file);

      const response = await this.axiosInstance.post(endpoint, formData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  /**
   * Run a comparison task with multiple files
   */
  async runComparisonTask(
    files: Record<string, File>,
    taskKey: string,
    fileType: FileType
  ): Promise<Record<string, unknown>> {
    try {
      const endpoint = this.getEndpoint(taskKey, fileType);
      const formData = new FormData();
      
      Object.entries(files).forEach(([key, file]) => {
          formData.append(key, file);
      });

      const response = await this.axiosInstance.post(endpoint, formData);
      return response.data;
    } catch (error) {
       if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  /**
   * Run validation on multiple files at once
   */
  async runMultipleValidations(
    files: Record<string, File>,
    taskKey: string,
    fileType: FileType
  ): Promise<Record<string, Record<string, unknown>>> {
    const results: Record<string, Record<string, unknown>> = {};

    for (const [key, file] of Object.entries(files)) {
      try {
        results[key] = await this.runValidationTask(file, taskKey, fileType);
      } catch (error) {
        results[key] = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }

    return results;
  }

  /**
   * Generate audit report for a file
   */
  async generateReport(
    file: File,
    fileType: FileType
  ): Promise<string> {
    try {
      const endpoint = "/report/generate/";
      const formData = new FormData();
      formData.append("file", file);

      const response = await this.axiosInstance.post(endpoint, formData);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  /**
   * Get the API endpoint for a specific task
   */
  private getEndpoint(taskKey: string, fileType: FileType): string {
    const taskMap: Record<string, keyof typeof API_ENDPOINTS> = {
      grammar: "grammar",
      "title-validation": "titleValidation",
      "section-validation": "sectionValidation",
      "format-comparison": "formatComparison",
      "google-validation": "googleValidation",
      "visual-validation": "visualValidation",
      "visual-comparison": "visualComparison",
      "ai-math-validation": "aiMathValidation",
      "reference-validation": "referenceValidation",
      "code-validation": "codeValidation",
      "accessibility-validation": "accessibilityValidation",
      "figure-placement": "figurePlacement",
      "table-placement": "tablePlacement",
      "word-count-validation": "wordCountValidation",
      "title-comparison": "titleComparison",
    };

    const apiKey = taskMap[taskKey];
    if (!apiKey) {
      throw new Error(`Unknown task: ${taskKey}`);
    }

    const endpoint = API_ENDPOINTS[apiKey]?.[fileType];
    if (!endpoint) {
      throw new Error(`No endpoint configured for task: ${taskKey}`);
    }

    return endpoint;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.axiosInstance.get("/health");
      return true;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();

