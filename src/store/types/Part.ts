

export interface Customer {
  _id: string;
  companyName: string;
  customerId: string;
}

export interface ProcessStep {
  processName: string;
  incomingVariation: Array<{
    qualityParameterName: string;
    description: string;
  }>;
  desiredOutcome: Array<{
    qualityParameterName: string;
    description: string;
  }>;
  toolsMaterials: string[];
}

export interface Part {
  _id: string;
  partNumber: string;
  description: string;
  customer: Customer;
  documents: string[];
  rawMaterial: string;
  quantityPerScrew: number;
  processSteps: ProcessStep[];
  createdAt: string;
  updatedAt: string;
}

export interface PartFormData {
  partNumber: string;
  description: string;
  customer: string;
  documents: string[];
  rawMaterial: string;
  quantityPerScrew: string;
  processSteps: ProcessStep[];
}
