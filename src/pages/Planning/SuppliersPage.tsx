import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface Company {
  _id: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  customerId: string;
  creditTerms: string;
  partNumbers: any[];
}

const SuppliersPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://manufacturing-frontend-rose.vercel.app/api/customers/');
        const data = await response.json();
        if (data.success) {
          setCompanies(data.data);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Suppliers Management</h2>
        <p className="text-slate-600">Manage your supplier relationships and information</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">Company Name</th>
                <th className="text-left p-4 font-semibold text-slate-700">Customer ID</th>
                <th className="text-left p-4 font-semibold text-slate-700">Email</th>
                <th className="text-left p-4 font-semibold text-slate-700">Phone</th>
                <th className="text-left p-4 font-semibold text-slate-700">Credit Terms</th>
                <th className="text-left p-4 font-semibold text-slate-700">Part Numbers</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{company.companyName}</td>
                  <td className="p-4 text-slate-600">{company.customerId}</td>
                  <td className="p-4 text-slate-600">{company.email}</td>
                  <td className="p-4 text-slate-600">{company.phone}</td>
                  <td className="p-4 text-slate-600">{company.creditTerms}</td>
                  <td className="p-4 text-slate-600">{company.partNumbers.length} parts</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {companies.length === 0 && (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No suppliers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage;