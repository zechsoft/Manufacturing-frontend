export interface Customer {
  _id: string;
  customerId: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  partNumbers: Array<{ _id: string; partNumber: string }>;// <-- FIXED
  GST: string;
  PAN: string;
  TAN: string;
  commercialEmail: string;
  creditTerms: 'Advance' | 'Net 7' | 'Net 10' | 'Net 15' | 'Net 30' | 'Net 60';
  creditDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFormData {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  GST: string;
  PAN: string;
  TAN: string;
  commercialEmail: string;
  creditTerms: string;
  creditDays: number;
  partNumbers: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  errors?: Array<{ field: string; message: string }>;
}