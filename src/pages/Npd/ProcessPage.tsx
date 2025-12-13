import { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

interface ProcessItem {
  id: string;
  machineType: string;
  lsiPartNumber: string;
  machineCode: string;
  partNumber: string;
  partName: string;
  rate: string;
  hsnCode: string;
  saeCode: string;
}

const ProcessPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Mock data
  const [processItems, setProcessItems] = useState<ProcessItem[]>([
    {
      id: '1',
      machineType: 'CNC Lathe',
      lsiPartNumber: 'LSI-001',
      machineCode: 'MC-001',
      partNumber: 'PN-12345',
      partName: 'Shaft Component',
      rate: '₹150',
      hsnCode: '8466',
      saeCode: 'SAE-1020'
    },
    {
      id: '2',
      machineType: 'Milling Machine',
      lsiPartNumber: 'LSI-002',
      machineCode: 'MC-002',
      partNumber: 'PN-12346',
      partName: 'Bracket Assembly',
      rate: '₹200',
      hsnCode: '8467',
      saeCode: 'SAE-1045'
    }
  ]);

  const [formData, setFormData] = useState<ProcessItem>({
    id: '',
    machineType: '',
    lsiPartNumber: '',
    machineCode: '',
    partNumber: '',
    partName: '',
    rate: '',
    hsnCode: '',
    saeCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (formData.id) {
      // Update existing
      setProcessItems(processItems.map(item => 
        item.id === formData.id ? formData : item
      ));
    } else {
      // Add new
      setProcessItems([...processItems, { ...formData, id: Date.now().toString() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: '',
      machineType: '',
      lsiPartNumber: '',
      machineCode: '',
      partNumber: '',
      partName: '',
      rate: '',
      hsnCode: '',
      saeCode: ''
    });
    setShowForm(false);
  };

  const handleEdit = (item: ProcessItem) => {
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setProcessItems(processItems.filter(item => item.id !== id));
    }
  };

  const filteredItems = processItems.filter(item =>
    item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.partName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Process Item Management</h1>
        <p className="text-gray-600">Manage machine and part details</p>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Part Number or Part Name..."
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
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="End Date"
        />
      </div>

      {/* Add New Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add New Process Item'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {formData.id ? 'Edit Process Item' : 'Add New Process Item'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Machine Type
              </label>
              <input
                type="text"
                name="machineType"
                value={formData.machineType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LSI Part Number
              </label>
              <input
                type="text"
                name="lsiPartNumber"
                value={formData.lsiPartNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Machine Code
              </label>
              <input
                type="text"
                name="machineCode"
                value={formData.machineCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Part Number
              </label>
              <input
                type="text"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Part Name
              </label>
              <input
                type="text"
                name="partName"
                value={formData.partName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate
              </label>
              <input
                type="text"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HSN Code
              </label>
              <input
                type="text"
                name="hsnCode"
                value={formData.hsnCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SAE Code
              </label>
              <input
                type="text"
                name="saeCode"
                value={formData.saeCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Machine Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                LSI Part Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Machine Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Part Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Part Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                HSN Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                SAE Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No process items found
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.machineType}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.lsiPartNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.machineCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.partNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.partName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.rate}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.hsnCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.saeCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessPage;