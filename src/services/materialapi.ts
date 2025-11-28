// src/services/api.ts
import type { Material, FormData } from '../store/types/Material'; // We'll create this type file next

const API_URL = `${import.meta.env.VITE_API_URL}/api/materials`;

// Fetch all materials
export const fetchMaterials = async (): Promise<Material[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch materials');
  }
  return response.json();
};

// Create new material
export const createMaterial = async (material: FormData): Promise<Material> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...material,
      materialId: material.materialId.toUpperCase()
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Create failed');
  }
  
  return response.json();
};

// Update existing material
export const updateMaterial = async (id: string, material: FormData): Promise<Material> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...material,
      materialId: material.materialId.toUpperCase()
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Update failed');
  }
  
  return response.json();
};

// Delete material
export const deleteMaterial = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Delete failed');
  }
};