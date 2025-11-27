import type { Part, ProcessStep } from '../../types/Part';

interface PartDetailsViewProps {
  part: Part;
  onClose: () => void;
}

const PartDetailsViewComponent = ({ part, onClose }: PartDetailsViewProps) => {
  // Safely handle potentially undefined arrays
  const safeDocuments = part.documents || [];
  const safeProcessSteps = part.processSteps || [];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Part Details: {part.partNumber}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-700">Part Number:</p>
              <p>{part.partNumber}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Customer:</p>
              <p>{part.customer?.companyName || 'N/A'} ({part.customer?.customerId || 'N/A'})</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Raw Material:</p>
              <p>{part.rawMaterial}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Quantity Per Screw:</p>
              <p>{part.quantityPerScrew}</p>
            </div>
            <div className="col-span-2">
              <p className="font-medium text-gray-700">Description:</p>
              <p>{part.description || 'No description provided'}</p>
            </div>
          </div>
        </div>

        {/* Documents */}
        {safeDocuments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Documents</h3>
            <ul className="space-y-2">
              {safeDocuments.map((doc, index) => (
                <li key={index} className="text-blue-600 hover:text-blue-800">
                  <a href={doc} target="_blank" rel="noopener noreferrer">{doc}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Process Steps */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Process Steps</h3>
          <div className="space-y-6">
            {safeProcessSteps.map((step: ProcessStep, index: number) => {
              // Safely handle potentially undefined arrays within process steps
              const safeIncomingVariation = step.incomingVariation || [];
              const safeDesiredOutcome = step.desiredOutcome || [];
              const safeToolsMaterials = step.toolsMaterials || [];

              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-lg mb-4">Step {index + 1}: {step.processName}</h4>

                  {/* Incoming Variation */}
                  {safeIncomingVariation.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Incoming Variation</h5>
                      <div className="grid grid-cols-2 gap-4">
                        {safeIncomingVariation.map((variation, vIndex) => (
                          <div key={vIndex} className="bg-white p-3 rounded border">
                            <p className="font-medium">{variation.qualityParameterName}</p>
                            <p className="text-gray-600">{variation.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Desired Outcome */}
                  {safeDesiredOutcome.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Desired Outcome</h5>
                      <div className="grid grid-cols-2 gap-4">
                        {safeDesiredOutcome.map((outcome, oIndex) => (
                          <div key={oIndex} className="bg-white p-3 rounded border">
                            <p className="font-medium">{outcome.qualityParameterName}</p>
                            <p className="text-gray-600">{outcome.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tools & Materials */}
                  {safeToolsMaterials.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Tools & Materials</h5>
                      <div className="flex flex-wrap gap-2">
                        {safeToolsMaterials.map((tool, tIndex) => (
                          <span key={tIndex} className="bg-white px-3 py-1 rounded border">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartDetailsViewComponent;