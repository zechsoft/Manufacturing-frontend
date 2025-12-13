import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, FileEdit } from 'lucide-react';

interface ProcessStep {
  id: string;
  slNo: number;
  process: string;
  processParameter: string;
  time: string;
  source: string;
  remark: string;
}

const ItemProcessPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [mode, setMode] = useState<'search' | 'enter' | 'view'>('search');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Mock parts data
  const availableParts = [
    { id: '1', partNumber: 'PN-12345', partName: 'Shaft Component' },
    { id: '2', partNumber: 'PN-12346', partName: 'Bracket Assembly' },
    { id: '3', partNumber: 'PN-12347', partName: 'Gear Housing' }
  ];

  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    {
      id: '1',
      slNo: 1,
      process: 'Forging',
      processParameter: 'Temperature: 1200°C, Pressure: 500 MPa',
      time: '30 min',
      source: 'Internal',
      remark: 'Pre-heating required'
    },
    {
      id: '2',
      slNo: 2,
      process: 'Heat Treatment',
      processParameter: 'Quenching at 850°C',
      time: '45 min',
      source: 'External',
      remark: 'Vendor: ABC Metals'
    }
  ]);

  const [formData, setFormData] = useState<ProcessStep>({
    id: '',
    slNo: processSteps.length + 1,
    process: '',
    processParameter: '',
    time: '',
    source: '',
    remark: ''
  });

  const handleSearch = () => {
    const found = availableParts.find(p => p.partNumber === searchTerm);
    if (found) {
      setSelectedPart(found.partNumber);
      setShowMessage(false);
      setMode('enter');
    } else {
      setSelectedPart('');
      setShowMessage(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (editingId) {
      setProcessSteps(processSteps.map(step => 
        step.id === editingId ? { ...formData, id: editingId } : step
      ));
      setEditingId(null);
    } else {
      setProcessSteps([...processSteps, { ...formData, id: Date.now().toString() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: '',
      slNo: processSteps.length + 1,
      process: '',
      processParameter: '',
      time: '',
      source: '',
      remark: ''
    });
  };

  const handleEdit = (step: ProcessStep) => {
    setFormData(step);
    setEditingId(step.id);
    setMode('enter');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this process step?')) {
      setProcessSteps(processSteps.filter(step => step.id !== id));
    }
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Item Process</h1>
        <p className="text-gray-600">Manage manufacturing process steps for parts</p>
      </div>

      {/* Search Section */}
      {mode === 'search' && (
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
        </div>
      )}

      {/* Mode Selection */}
      {selectedPart && mode !== 'search' && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex-1">
              <strong>Selected Part:</strong> {selectedPart}
            </div>
            <button
              onClick={() => setMode('search')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Change Part
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setMode('enter')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                mode === 'enter' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              Enter Data
            </button>
            <button
              onClick={() => setMode('view')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                mode === 'view' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Eye className="w-4 h-4" />
              View Data
            </button>
          </div>
        </div>
      )}

      {/* Enter Data Mode */}
      {mode === 'enter' && selectedPart && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Process Step' : 'Add Process Step'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sl No
              </label>
              <input
                type="number"
                name="slNo"
                value={formData.slNo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Process
              </label>
              <select
                name="process"
                value={formData.process}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Process</option>
                <option value="Forging">Forging</option>
                <option value="Rolling">Rolling</option>
                <option value="Heat Treatment">Heat Treatment</option>
                <option value="Zinc Plate Yellow">Zinc Plate Yellow</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Process Parameter
              </label>
              <input
                type="text"
                name="processParameter"
                value={formData.processParameter}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="e.g., 30 min"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Source</option>
                <option value="Internal">Internal</option>
                <option value="External">External</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remark
              </label>
              <input
                type="text"
                name="remark"
                value={formData.remark}
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
              {editingId ? 'Update' : 'Add Process'}
            </button>
            <button
              onClick={() => {
                resetForm();
                setEditingId(null);
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* View Data Mode */}
      {mode === 'view' && selectedPart && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Sl No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Process
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Process Parameter
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Remark
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {processSteps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No process steps found. Click "Enter Data" to add process steps.
                    </td>
                  </tr>
                ) : (
                  processSteps.map((step) => (
                    <tr key={step.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{step.slNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{step.process}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{step.processParameter}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{step.time}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          step.source === 'Internal' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {step.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{step.remark}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(step)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(step.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
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
      )}
    </div>
  );
};

export default ItemProcessPage;