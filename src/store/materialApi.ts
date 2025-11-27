export interface Material {
  _id: string;
  materialId: string;
  name: string;
  description?: string;
  currentStock: number;
  unit: string;
  reorderLevel: number;
  supplier?: string;
  lastRestockDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const getAllMaterials = async (): Promise<Material[]> => {
  return request('/materials');
};

export const getMaterialById = async (id: string): Promise<Material> => {
  return request(`/materials/${id}`);
};

export const createMaterial = async (materialData: Omit<Material, '_id' | 'createdAt' | 'updatedAt'>): Promise<Material> => {
  return request('/materials', {
    method: 'POST',
    body: JSON.stringify(materialData),
  });
};

export const updateMaterial = async (id: string, materialData: Partial<Material>): Promise<Material> => {
  return request(`/materials/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(materialData),
  });
};

export const deleteMaterial = async (id: string): Promise<void> => {
  return request(`/materials/${id}`, {
    method: 'DELETE',
  });
};
