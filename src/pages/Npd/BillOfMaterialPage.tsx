import { useState } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';

interface RMRow {
  id: string;
  type: string;
  grade: string;
  weight: string;
}

const BillOfMaterialPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  // Mock parts data
  const availableParts = [
    { id: '1', partNumber: 'PN-12345', partName: 'Shaft Component' },
    { id: '2', partNumber: 'PN-12346', partName: 'Bracket Assembly' },
    { id: '3', partNumber: 'PN-12347', partName: 'Gear Housing' }
  ];

  const [rmRows, setRmRows] = useState<RMRow[]>([
    { id: '1', type: '', grade: '', weight: '' }
  ]);

  const handleSearch = () => {
    const found = availableParts.find(p => p.partNumber === searchTerm);
    if (found) {
      setSelectedPart(found.partNumber);
      setShowMessage(false);
    } else {
      setSelectedPart('');
      setShowMessage(true);
    }
  };

  const addRow = () => {
    setRmRows([...rmRows, { id: Date.now().toString(), type: '', grade: '', weight: '' }]);
  };

  const deleteRow = (id: string) => {
    if (rmRows.length > 1) {
      setRmRows(rmRows.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof RMRow, value: string) => {
    setRmRows(rmRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleSave = () => {
    alert('Bill of Material saved successfully!');
    console.log('Saved data:', { partNumber: selectedPart, rmRows });
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bill of Material</h1>
        <p className="text-gray-600">Create and manage bill of materials for parts</p>
      </div>

      {/* Search Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Search Part</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter Part Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>

        {showMessage && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Part number not found in database. Please create the part first in Process page.
          </div>
        )}

        {selectedPart && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Part found: {selectedPart}
          </div>
        )}
      </div>

      {/* RM Table */}
      {selectedPart && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Raw Material Details</h2>
            <button
              onClick={addRow}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Type of RM
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    RM Grade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    RM Weight (kg)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rmRows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3">
                      <select
                        value={row.type}
                        onChange={(e) => updateRow(row.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
                        <option value="MS">MS (Mild Steel)</option>
                        <option value="SS">SS (Stainless Steel)</option>
                        <option value="Braze">Braze</option>
                        <option value="Copper">Copper</option>
                        <option value="Aluminum">Aluminum</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={row.grade}
                        onChange={(e) => updateRow(row.id, 'grade', e.target.value)}
                        placeholder="Enter grade"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        value={row.weight}
                        onChange={(e) => updateRow(row.id, 'weight', e.target.value)}
                        placeholder="Enter weight"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteRow(row.id)}
                        disabled={rmRows.length === 1}
                        className={`text-red-600 hover:text-red-800 ${rmRows.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Bill of Material
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillOfMaterialPage;