// src/types/material.ts
export interface Material {
  id: string;
  materialId: string;
  name: string;
  description?: string;
  unit: string;
  currentStock: number;
  minStockLevel?: number;
  supplier?: string;
}

export interface FormData {
  materialId: string;
  name: string;
  description: string;
  unit: string;
  currentStock: number;
  minStockLevel: number;
  supplier: string;
}

export interface Errors {
  materialId?: string;
  name?: string;
  currentStock?: string;
  minStockLevel?: string;
}

export interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}