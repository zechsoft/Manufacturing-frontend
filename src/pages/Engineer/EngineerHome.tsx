import { useAuthStore } from "../../store/authStore";
import { Wrench, FileText, Package } from "lucide-react";

const EngineerHome = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen overflow-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome back, {user?.name || "Engineer"}! 👋
        </h1>

        <p className="text-gray-700 mb-2">
          You are logged in as an <span className="font-semibold text-blue-600">engineer</span>.
        </p>
        <p className="text-gray-700 mb-6">
          Role: <span className="font-semibold text-green-600">Engineer</span>
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Engineer Tools</h2>
        <p className="text-gray-600 mb-6">
          Use the sidebar to navigate through different engineering sections.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-center shadow-sm hover:shadow-md transition">
            <Package className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-800">Parts Management</h3>
            <p className="text-sm text-gray-600">View and manage part details.</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-5 text-center shadow-sm hover:shadow-md transition">
            <FileText className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-800">Documents</h3>
            <p className="text-sm text-gray-600">Upload and review design documents.</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 text-center shadow-sm hover:shadow-md transition">
            <Wrench className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
            <h3 className="font-semibold text-gray-800">Settings</h3>
            <p className="text-sm text-gray-600">Update preferences and account details.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerHome;
