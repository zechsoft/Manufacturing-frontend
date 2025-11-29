import { RefreshCw } from 'lucide-react';
import type { Part } from '../../store/types/Part';

interface PartsListViewProps {
  parts: Part[];
  loading: boolean;
  onEdit: (part: Part) => void;
  onView: (part: Part) => void;
}

const PartsListView = ({ parts, loading, onEdit, onView }: PartsListViewProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-4">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          </div>
        ) : parts.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No parts found. Create your first part!
          </div>
        ) : (
          parts.map((part) => (
            <div key={part._id} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {part.partNumber}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {part.description || 'No description'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(part)}
                    className="px-3 py-1 text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 rounded-md flex items-center gap-1"
                  >
                    <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    Edit
                  </button>
                  <button
                    onClick={() => onView(part)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800 border border-gray-600 hover:border-gray-800 rounded-md flex items-center gap-1"
                  >
                    <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    View
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Customer: </span>
                  {part.customer.companyName} ({part.customer.customerId})
                </div>
                <div>
                  <span className="font-medium text-gray-700">Raw Material: </span>
                  {part.rawMaterial}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Quantity Per Screw: </span>
                  {part.quantityPerScrew}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Process Steps: </span>
                  {part.processSteps.length}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PartsListView;
