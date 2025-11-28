import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { Customer, CustomerFormData } from '../../store/types/customer';
import { getValidationErrors } from '../../utils/customervalidation';
import LoadingSpinner from './LoadingSpinner';

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (data: CustomerFormData) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
  title: string;
}

const creditTermsOptions = ['Advance', 'Net 7', 'Net 10', 'Net 15', 'Net 30', 'Net 60'];

export const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSubmit,
  onClose,
  title
}) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    companyName: '',
    phone: '',
    email: '',
    address: '',
    GST: '',
    PAN: '',
    TAN: '',
    commercialEmail: '',
    creditTerms: 'Net 30',
    creditDays: 30,
    partNumbers: [],
    vendorType: '',  
    vendorCode: 0,  
    accountHolderName: '',   // bank details
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        companyName: customer.companyName,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        GST: customer.GST,
        PAN: customer.PAN,
        TAN: customer.TAN,
        commercialEmail: customer.commercialEmail,
        creditTerms: customer.creditTerms,
        creditDays: customer.creditDays,
        partNumbers: customer.partNumbers,
        vendorType: customer.vendorType || '',
        vendorCode: customer.vendorCode || 0,
        accountHolderName: customer.accountHolderName || '',
        bankName: customer.bankName || '',
        accountNumber: customer.accountNumber || '',
        ifscCode: customer.ifscCode || '',
        branch: customer.branch || ''
      });
    }
  }, [customer]);

  const handleInputChange = (field: keyof CustomerFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = getValidationErrors(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit(formData);
    setIsSubmitting(false);

    if (result.success) onClose();
    else setErrors({ submit: result.error || 'Failed to save customer' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.companyName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter company name"
              />
              {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+91 9876543210"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="company@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Commercial Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commercial Email *</label>
              <input
                type="email"
                value={formData.commercialEmail}
                onChange={(e) => handleInputChange('commercialEmail', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.commercialEmail ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="commercial@example.com"
              />
              {errors.commercialEmail && <p className="text-red-500 text-sm mt-1">{errors.commercialEmail}</p>}
            </div>
          </div>

          {/* Vendor Type / Vendor Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Type *</label>
              <input
                type="text"
                value={formData.vendorType}
                onChange={(e) => handleInputChange('vendorType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.vendorType ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter vendor type"
              />
              {errors.vendorType && <p className="text-red-500 text-sm mt-1">{errors.vendorType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Code *</label>
              <input
                type="number"
                value={formData.vendorCode}
                onChange={(e) => handleInputChange('vendorCode', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.vendorCode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter vendor code"
              />
              {errors.vendorCode && <p className="text-red-500 text-sm mt-1">{errors.vendorCode}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter complete address (minimum 10 characters)"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* GST / PAN / TAN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number *</label>
              <input
                type="text"
                value={formData.GST}
                onChange={(e) => handleInputChange('GST', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.GST ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="22AAAAA0000A1Z5"
                maxLength={15}
              />
              {errors.GST && <p className="text-red-500 text-sm mt-1">{errors.GST}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number *</label>
              <input
                type="text"
                value={formData.PAN}
                onChange={(e) => handleInputChange('PAN', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.PAN ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="ABCDE1234F"
                maxLength={10}
              />
              {errors.PAN && <p className="text-red-500 text-sm mt-1">{errors.PAN}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TAN Number *</label>
              <input
                type="text"
                value={formData.TAN}
                onChange={(e) => handleInputChange('TAN', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.TAN ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="ABCD12345E"
                maxLength={10}
              />
              {errors.TAN && <p className="text-red-500 text-sm mt-1">{errors.TAN}</p>}
            </div>
          </div>

          {/* Credit Terms / Credit Days */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Terms</label>
              <select
                value={formData.creditTerms}
                onChange={(e) => handleInputChange('creditTerms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {creditTermsOptions.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Days</label>
              <input
                type="number"
                value={formData.creditDays}
                onChange={(e) => handleInputChange('creditDays', parseInt(e.target.value) || 0)}
                min="0"
                max="90"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.creditDays ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.creditDays && <p className="text-red-500 text-sm mt-1">{errors.creditDays}</p>}
            </div>
          </div>

          {/* Bank Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name *</label>
              <input
                type="text"
                value={formData.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.accountHolderName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter account holder name"
              />
              {errors.accountHolderName && <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.bankName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter bank name"
              />
              {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.accountNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter account number"
              />
              {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code *</label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.ifscCode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter IFSC code"
              />
              {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => handleInputChange('branch', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.branch ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter branch"
              />
              {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
