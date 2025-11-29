import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  creditTermFilter: string;
  onCreditTermFilterChange: (value: string) => void;
}

const creditTermsOptions = ['All', 'Advance', 'Net 7', 'Net 10', 'Net 15', 'Net 30', 'Net 60'];

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  creditTermFilter,
  onCreditTermFilterChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by company name, email, or customer ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <select
          value={creditTermFilter}
          onChange={(e) => onCreditTermFilterChange(e.target.value)}
          className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[140px]"
        >
          {creditTermsOptions.map(option => (
            <option key={option} value={option}>
              {option} Terms
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
