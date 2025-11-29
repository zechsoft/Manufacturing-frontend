import { useState, useEffect } from 'react';
import type { Customer, Part, Order, PopulatedOrder } from '../store/types/orders';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// API utility functions
export const api = {
  // Customer endpoints
  customers: {
    getAll: async (): Promise<Customer[]> => {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch customers');
      const result = await response.json();
      return result.data || result;
    },
    
    getById: async (id: string): Promise<Customer> => {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch customer');
      const result = await response.json();
      return result.data || result;
    },
    
    create: async (customer: Partial<Customer>): Promise<Customer> => {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(customer),
      });
      if (!response.ok) throw new Error('Failed to create customer');
      const result = await response.json();
      return result.data || result;
    }
  },
  
  // Parts endpoints  
  parts: {
    getByCustomer: async (customerId: string): Promise<Part[]> => {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch customers');
      const result = await response.json();
      const customers = result.data || result;
      
      // Find the specific customer
      const customer = customers.find((c: Customer) => c._id === customerId);
      if (!customer) throw new Error('Customer not found');
      
      // Convert partNumbers to Part objects
      const parts: Part[] = customer.partNumbers.map((partNum: any) => ({
        _id: partNum._id,
        partNumber: partNum.partNumber,
        description: `Part ${partNum.partNumber}`, // Default description
        customer: customerId,
        documents: [],
        rawMaterial: 'Unknown', // Default value
        quantityPerScrew: 1, // Default value
        processSteps: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      return parts;
    }
  },
  
  // Orders endpoints
  orders: {
    getAll: async (): Promise<PopulatedOrder[]> => {
      const response = await fetch(`${API_BASE_URL}/planning`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const result = await response.json();
      return result.data || result;
    },
    
    create: async (order: Order): Promise<PopulatedOrder> => {
      const response = await fetch(`${API_BASE_URL}/planning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(order),
      });
      if (!response.ok) {
        const error = await response.json();
        // Handle duplicate order number error specifically
        if (error.error && error.error.includes('E11000 duplicate key error')) {
          throw new Error('Order number conflict. Please try again - the system will generate a new unique order number.');
        }
        throw new Error(error.message || error.error || 'Failed to create order');
      }
      const result = await response.json();
      return result.data || result;
    },
    
    update: async (id: string, order: Partial<Order>): Promise<PopulatedOrder> => {
      const response = await fetch(`${API_BASE_URL}/planning/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(order),
      });
      if (!response.ok) throw new Error('Failed to update order');
      const result = await response.json();
      return result.data || result;
    }
  }
};

// Custom hooks
export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await api.customers.getAll();
        setCustomers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return { customers, loading, error, refetch: () => setLoading(true) };
};

export const useParts = (customerId: string | null) => {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setParts([]);
      return;
    }

    const fetchParts = async () => {
      try {
        setLoading(true);
        const data = await api.parts.getByCustomer(customerId);
        setParts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch parts');
        setParts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, [customerId]);

  return { parts, loading, error };
};

export const useOrders = () => {
  const [orders, setOrders] = useState<PopulatedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.orders.getAll();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
};