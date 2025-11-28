import { useState } from 'react';
import { Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import type { Customer, PartFormData, ProcessStep } from '../../store/types/Part';

interface PartFormProps {
  initialData?: PartFormData;
  customers: Customer[];
  loading: boolean;
  onSubmit: (formData: PartFormData) => Promise<void>;
  fetchCustomers: () => Promise<void>;
}

const PartForm = ({ initialData, customers, loading, onSubmit, fetchCustomers }: PartFormProps) => {
  const [formData, setFormData] = useState<PartFormData>(initialData || {
    partNumber: '',
    description: '',
    customer: '',
    documents: [''],
    rawMaterial: '',
    quantityPerScrew: '',
    processSteps: [{
      processName: '',
      incomingVariation: [{
        qualityParameterName: '',
        description: ''
      }],
      desiredOutcome: [{
        qualityParameterName: '',
        description: ''
      }],
      toolsMaterials: ['']
    }]
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle document changes
  const handleDocumentChange = (index: number, value: string) => {
    const newDocuments = [...formData.documents];
    newDocuments[index] = value;
    setFormData(prev => ({
      ...prev,
      documents: newDocuments
    }));
  };

  const addDocument = () => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, '']
    }));
  };

  const removeDocument = (index: number) => {
    const newDocuments = formData.documents.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      documents: newDocuments
    }));
  };

  // Handle process step changes
  const handleProcessStepChange = (stepIndex: number, field: keyof ProcessStep, value: string) => {
    const newProcessSteps = [...formData.processSteps];
    newProcessSteps[stepIndex] = {
      ...newProcessSteps[stepIndex],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      processSteps: newProcessSteps
    }));
  };

  const addProcessStep = () => {
    setFormData(prev => ({
      ...prev,
      processSteps: [...prev.processSteps, {
        processName: '',
        incomingVariation: [{
          qualityParameterName: '',
          description: ''
        }],
        desiredOutcome: [{
          qualityParameterName: '',
          description: ''
        }],
        toolsMaterials: ['']
      }]
    }));
  };

  const removeProcessStep = (stepIndex: number) => {
    const newProcessSteps = formData.processSteps.filter((_, i) => i !== stepIndex);
    setFormData(prev => ({
      ...prev,
      processSteps: newProcessSteps
    }));
  };

  // Handle incoming variation changes
  const handleIncomingVariationChange = (
    stepIndex: number,
    variationIndex: number,
    field: 'qualityParameterName' | 'description',
    value: string
  ) => {
    const newProcessSteps = [...formData.processSteps];
    newProcessSteps[stepIndex].incomingVariation[variationIndex] = {
      ...newProcessSteps[stepIndex].incomingVariation[variationIndex],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      processSteps: newProcessSteps
    }));
  };

  const addIncomingVariation = (stepIndex: number) => {
    const newProcessSteps = [...formData.processSteps];
    newProcessSteps[stepIndex].incomingVariation.push({
      qualityParameterName: '',
      description: ''
    });
    setFormData(prev => ({
      ...prev,
      processSteps: newProcessSteps
    }));
  };

  const removeIncomingVariation = (stepIndex: number, variationIndex: number) => {
    const newProcessSteps = [...formData.processSteps];
    newProcessSteps[stepIndex].incomingVariation =
      newProcessSteps[stepIndex].incomingVariation.filter((_, i) => i !== variationIndex);
    setFormData(prev => ({
      ...prev,
      processSteps: newProcessSteps
    }));
  };

  // Handle desired outcome changes
  const handleDesiredOutcomeChange = (
    stepIndex: number,
    outcomeIndex: number,
    field: 'qualityParameterName' | 'description',
    value: string
  ) => {
    const newProcessSteps = [...formData.processSteps];
    newProcessSteps[stepIndex].desiredOutcome[outcomeIndex] = {
      ...newProcessSteps[stepIndex].desiredOutcome[outcomeIndex],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      processSteps: newProcessSteps
    }));
  };

  const addDesiredOutcome = (stepIndex: number) => {
    const newProcessSteps = [...formData.processSteps];
    newProcessSteps[stepIndex].desiredOutcome.push({
      qualityParameterName: '',
      description: ''
    });
    setFormData(prev => ({
      ...prev,
      processSteps: newProcessSteps
    }));
  };

  const removeDesiredOutcome = (stepIndex: number, outcomeIndex: number) => {
    const newProcessSteps = [...formData.processSteps];
    newProcessSteps[stepIndex].desiredOutcome =
      newProcessSteps[stepIndex].desiredOutcome.filter((_, i) => i !== outcomeIndex);
    setFormData(prev => ({
      ...prev,
      processSteps: newProcessSteps
    }));
  };

  // Handle tools/materials changes
  const handleToolMaterialChange = (stepIndex: number, toolIndex: number, value: string) => {
    const newProcessSteps = [...formData.processSteps];
    newProcessSteps[stepIndex].toolsMaterials[toolIndex] = value;
    setFormData(prev => ({
      ...prev,
      processSteps: newProcessSteps
    }));
  };

  const addToolMaterial = (stepIndex: number) => {
    const newProcessSteps = [...formData.processSteps];
    newProcessSteps[stepIndex].toolsMaterials.push('');
    setFormData(prev => ({
      ...prev,
      processSteps: newProcessSteps
    }));
  };

  const removeToolMaterial = (stepIndex: number, toolIndex: number) => {
    const newProcessSteps = [...formData.processSteps];
    newProcessSteps[stepIndex].toolsMaterials =
      newProcessSteps[stepIndex].toolsMaterials.filter((_, i) => i !== toolIndex);
    setFormData(prev => ({
      ...prev,
      processSteps: newProcessSteps
    }));
  };

  // Submit form
  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Part Number *
            </label>
            <input
              type="text"
              name="partNumber"
              value={formData.partNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer *
              <button
                type="button"
                onClick={fetchCustomers}
                className="ml-2 p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                title="Refresh customer list"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </label>
            <div className="relative">
              <select
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${loading ? 'bg-gray-50' : ''}`}
                required
                disabled={loading}
              >
                <option value="">Select a customer</option>
                {loading ? (
                  <option value="" disabled>Loading customers...</option>
                ) : customers.length === 0 ? (
                  <option value="" disabled>No customers found</option>
                ) : (
                  customers.map(customer => (
                    <option key={customer._id} value={customer._id}>
                      {customer.companyName} ({customer.customerId})
                    </option>
                  ))
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raw Material *
            </label>
            <input
              type="text"
              name="rawMaterial"
              value={formData.rawMaterial}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity Per Screw *
            </label>
            <input
              type="number"
              name="quantityPerScrew"
              value={formData.quantityPerScrew}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Documents</h2>
        {formData.documents.map((document, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={document}
              onChange={(e) => handleDocumentChange(index, e.target.value)}
              placeholder="Document URL or path"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.documents.length > 1 && (
              <button
                type="button"
                onClick={() => removeDocument(index)}
                className="px-3 py-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addDocument}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-2"
        >
          <Plus className="w-4 h-4" />
          Add Document
        </button>
      </div>

      {/* Process Steps */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Process Steps</h2>
          <button
            type="button"
            onClick={addProcessStep}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Process Step
          </button>
        </div>

        {formData.processSteps.map((step, stepIndex) => (
          <div key={stepIndex} className="bg-white p-4 rounded-lg mb-4 border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Process Step {stepIndex + 1}
              </h3>
              {formData.processSteps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProcessStep(stepIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Process Name *
              </label>
              <input
                type="text"
                value={step.processName}
                onChange={(e) => handleProcessStepChange(stepIndex, 'processName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Incoming Variation */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Incoming Variation
                </label>
                <button
                  type="button"
                  onClick={() => addIncomingVariation(stepIndex)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Variation
                </button>
              </div>
              {step.incomingVariation.map((variation, variationIndex) => (
                <div key={variationIndex} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 p-2 bg-gray-50 rounded">
                  <input
                    type="text"
                    value={variation.qualityParameterName}
                    onChange={(e) => handleIncomingVariationChange(stepIndex, variationIndex, 'qualityParameterName', e.target.value)}
                    placeholder="Quality Parameter Name *"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={variation.description}
                      onChange={(e) => handleIncomingVariationChange(stepIndex, variationIndex, 'description', e.target.value)}
                      placeholder="Description"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {step.incomingVariation.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIncomingVariation(stepIndex, variationIndex)}
                        className="px-2 py-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desired Outcome */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Desired Outcome
                </label>
                <button
                  type="button"
                  onClick={() => addDesiredOutcome(stepIndex)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Outcome
                </button>
              </div>
              {step.desiredOutcome.map((outcome, outcomeIndex) => (
                <div key={outcomeIndex} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 p-2 bg-gray-50 rounded">
                  <input
                    type="text"
                    value={outcome.qualityParameterName}
                    onChange={(e) => handleDesiredOutcomeChange(stepIndex, outcomeIndex, 'qualityParameterName', e.target.value)}
                    placeholder="Quality Parameter Name *"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={outcome.description}
                      onChange={(e) => handleDesiredOutcomeChange(stepIndex, outcomeIndex, 'description', e.target.value)}
                      placeholder="Description"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {step.desiredOutcome.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDesiredOutcome(stepIndex, outcomeIndex)}
                        className="px-2 py-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Tools & Materials */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tools & Materials
                </label>
                <button
                  type="button"
                  onClick={() => addToolMaterial(stepIndex)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Tool/Material
                </button>
              </div>
              {step.toolsMaterials.map((tool, toolIndex) => (
                <div key={toolIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tool}
                    onChange={(e) => handleToolMaterialChange(stepIndex, toolIndex, e.target.value)}
                    placeholder="Tool or Material"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {step.toolsMaterials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeToolMaterial(stepIndex, toolIndex)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitLoading}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {submitLoading ? 'Saving...' : initialData ? 'Update Part' : 'Create Part'}
        </button>
      </div>
    </div>
  );
};

export default PartForm;
