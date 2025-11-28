import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Building2, Package } from 'lucide-react';

interface PO {
  _id: string;
  totalValue: number;
  isOpen: boolean;
}

const AnalyticsPage: React.FC = () => {
  const [pos, setPOs] = useState<PO[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [posResponse, companiesResponse] = await Promise.all([
          fetch('http://localhost:5000/api/planning/po'),
          fetch('http://localhost:5000/api/customers/')
        ]);
        
        const posData = await posResponse.json();
        const companiesData = await companiesResponse.json();
        
        if (Array.isArray(posData)) setPOs(posData);
        if (companiesData.success) setCompanies(companiesData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalValue = pos.reduce((sum, po) => sum + po.totalValue, 0);
  const avgValue = pos.length > 0 ? Math.round(totalValue / pos.length) : 0;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Analytics Dashboard</h2>
        <p className="text-slate-600">View insights and metrics for your purchase orders</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Total PO Value</h3>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">₹{totalValue.toLocaleString()}</p>
          <p className="text-slate-500 text-sm mt-2">Across {pos.length} purchase orders</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Average PO Value</h3>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">₹{avgValue.toLocaleString()}</p>
          <p className="text-slate-500 text-sm mt-2">Per purchase order</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Active Suppliers</h3>
            <Building2 className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{companies.length}</p>
          <p className="text-slate-500 text-sm mt-2">Total registered suppliers</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">PO Status Distribution</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Active POs</span>
            <div className="flex items-center space-x-2">
              <div className="bg-green-200 rounded-full h-3 w-20"></div>
              <span className="text-slate-800 font-medium">{pos.filter(po => po.isOpen).length}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Closed POs</span>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-200 rounded-full h-3 w-12"></div>
              <span className="text-slate-800 font-medium">{pos.filter(po => !po.isOpen).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;