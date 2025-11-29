export interface Customer {
  _id: string;
  customerId: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  partNumbers: string[];
  GST: string;
  PAN: string;
  TAN: string;
  commercialEmail: string;
  creditTerms: string;
  creditDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface Part {
  _id: string;
  partNumber: string;
  description: string;
  customer: string;
  documents: string[];
  rawMaterial: string;
  quantityPerScrew: number;
  processSteps: ProcessStep[];
  createdAt: string;
  updatedAt: string;
}

export interface ProcessStep {
  processName: string;
  incomingVariation: QualityParameter[];
  desiredOutcome: QualityParameter[];
  toolsMaterials: string[];
}

export interface QualityParameter {
  qualityParameterName: string;
  description: string;
}

export interface OrderPart {
  part_number: string;
  quantity: number;
}

export interface Order {
  _id?: string;
  order_number?: string;
  po_number: string;
  customer_id: string;
  company_name?: string;
  ordered_date: string;
  delivery_date: string;
  planning_date: string;
  production_date: string;
  status: 'pending' | 'adminApproved' | 'productionHeadApproved' | 'businessHeadApproved';
  uploaded_by?: string;
  parts: OrderPart[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PopulatedOrder extends Omit<Order, 'customer_id' | 'parts'> {
  customer_id: Customer;
  parts: Array<{
    part_number: Part;
    quantity: number;
  }>;
}
