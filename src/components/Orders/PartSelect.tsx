import React from 'react';
import { Package, Plus, Minus, Loader2 } from 'lucide-react';
import type { Part, OrderPart } from '../../store/types/orders';

interface PartSelectProps {
  parts: Part[];
  selectedParts: OrderPart[];
  onPartsChange: (parts: OrderPart[]) => void;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
}

const PartSelect: React.FC<PartSelectProps> = ({
  parts,
  selectedParts,
  onPartsChange,
  loading = false,
  error = null,
  disabled = false
}) => {
  const addPart = (partId: string) => {
    const existingPart = selectedParts.find(p => p.part_number === partId);
    if (existingPart) {
      onPartsChange(
        selectedParts.map(p => 
          p.part_number === partId 
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      onPartsChange([...selectedParts, { part_number: partId, quantity: 1 }]);
    }
  };

  const updateQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      onPartsChange(selectedParts.filter(p => p.part_number !== partId));
    } else {
      onPartsChange(
        selectedParts.map(p => 
          p.part_number === partId 
            ? { ...p, quantity }
            : p
        )
      );
    }
  };

  const removePart = (partId: string) => {
    onPartsChange(selectedParts.filter(p => p.part_number !== partId));
  };

  if (disabled) {
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Package className="w-4 h-4" />
          Select Parts
        </label>
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Please select a customer first to view available parts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Package className="w-4 h-4" />
        Select Parts
      </label>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading parts...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && parts.length === 0 && (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
          <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>No parts available for this customer</p>
        </div>
      )}

      {!loading && !error && parts.length > 0 && (
        <div className="space-y-3">
          <div className="grid gap-3">
            {parts.map((part) => {
              const selectedPart = selectedParts.find(p => p.part_number === part._id);
              const isSelected = !!selectedPart;
              
              return (
                <div
                  key={part._id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-200 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{part.partNumber}</h4>
                      <p className="text-sm text-gray-600 mt-1">{part.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Material: {part.rawMaterial}</span>
                        <span>Qty/Screw: {part.quantityPerScrew}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(part._id, selectedPart.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-red-400 hover:bg-red-50 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600 hover:text-red-600" />
                          </button>
                          
                          <input
                            type="number"
                            min="1"
                            value={selectedPart.quantity}
                            onChange={(e) => updateQuantity(part._id, parseInt(e.target.value) || 1)}
                            className="w-16 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          
                          <button
                            type="button"
                            onClick={() => updateQuantity(part._id, selectedPart.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-green-400 hover:bg-green-50 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600 hover:text-green-600" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addPart(part._id)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedParts.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Selected Parts ({selectedParts.length})</h4>
              <div className="space-y-1">
                {selectedParts.map((selectedPart) => {
                  const part = parts.find(p => p._id === selectedPart.part_number);
                  return (
                    <div key={selectedPart.part_number} className="flex items-center justify-between text-sm">
                      <span className="text-green-700">
                        {part?.partNumber} × {selectedPart.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePart(selectedPart.part_number)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PartSelect;
