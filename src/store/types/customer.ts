export interface Customer {
  vendorType: string;
  vendorCode: number;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
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
  vendorType: string | number | readonly string[] | undefined;
  vendorCode: string | number | readonly string[] | undefined;
  accountHolderName: string | number | readonly string[] | undefined;
  bankName: string | number | readonly string[] | undefined;
  accountNumber: string | number | readonly string[] | undefined;
  ifscCode: string | number | readonly string[] | undefined;
  branch: string | number | readonly string[] | undefined;
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
