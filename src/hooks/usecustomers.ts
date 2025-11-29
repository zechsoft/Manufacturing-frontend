import { useState, useEffect } from 'react';
import type { Customer, ApiResponse } from '../store/types/customer';
import { apiService } from '../services/customerapi';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllCustomers() as ApiResponse<Customer[]>;
      if (response.success && response.data) {
        setCustomers(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData: any) => {
    try {
      const response = await apiService.createCustomer(customerData) as ApiResponse<Customer>;
      if (response.success && response.data) {
        setCustomers(prev => [...prev, response.data!]);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to add customer';
      return { success: false, error };
    }
  };

  const updateCustomer = async (id: string, customerData: any) => {
    try {
      const response = await apiService.updateCustomer(id, customerData) as ApiResponse<Customer>;
      if (response.success && response.data) {
        setCustomers(prev => 
          prev.map(customer => 
            customer._id === id ? response.data! : customer
          )
        );
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update customer';
      return { success: false, error };
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const response = await apiService.deleteCustomer(id) as ApiResponse<any>;
      if (response.success) {
        setCustomers(prev => prev.filter(customer => customer._id !== id));
        return { success: true };
      }
      return { success: false, error: response.message || 'Delete failed' };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete customer';
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
