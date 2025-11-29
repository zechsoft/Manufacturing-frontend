import { useState, useEffect } from 'react';
import { 
  Plus, 
  RefreshCw, 
  Home, 
  Settings, 
  LogOut, 
  FileText, 
  User, 
  Package 
} from 'lucide-react';
import type { Part, Customer, PartFormData } from '../../store/types/Part';
import { useAuthStore } from "../../store/authStore";
import PartsListView from '../../components/parts/PartsListView';
import PartForm from '../../components/parts/PartForm';
import PartDetailsView from '../../components/parts/PartDetailsView';
import type { Material } from '../../store/materialApi';
import { getAllMaterials } from '../../store/materialApi';
import { apiService } from '../../services/customerapi';   
import { NavLink } from 'react-router-dom';
import { Outlet } from "react-router-dom";

interface CustomerResponse {
  data?: Customer[];
  customers?: Customer[];
}

const EngineerDashboard = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [editingPartId, setEditingPartId] = useState<string | null>(null);
  const [initialFormData, setInitialFormData] = useState<PartFormData | undefined>(undefined);

  // Fetch initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [customersResponse, materialsData] = await Promise.all([
          apiService.getAllCustomers(),
          getAllMaterials()
        ]);
        
        // Handle customers data based on response structure
        if (customersResponse && typeof customersResponse === 'object') {
          const customerResp = customersResponse as CustomerResponse | Customer[];
          if (Array.isArray(customerResp)) {
            setCustomers(customerResp);
          } else if (customerResp.data && Array.isArray(customerResp.data)) {
            setCustomers(customerResp.data);
          } else if (customerResp.customers && Array.isArray(customerResp.customers)) {
            setCustomers(customerResp.customers);
          } else {
            console.error('Unexpected customer data structure:', customersResponse);
            setCustomers([]);
          }
        } else {
          console.error('Invalid customer data received:', customersResponse);
          setCustomers([]);
        }
        
        // Handle materials data
        if (Array.isArray(materialsData)) {
          setMaterials(materialsData);
        } else {
          console.error('Invalid materials data received:', materialsData);
          setMaterials([]);
        }
        
        await fetchParts();
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setCustomers([]);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const fetchParts = async () => {
    setLoading(true);
    try {
      // Fixed: Use VITE_API_URL instead of REACT_APP_API_URL
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/engineer`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setParts(data);
        } else {
          console.error('Expected parts data to be an array');
          setParts([]);
        }
      } else {
        console.error('Failed to fetch parts');
        setParts([]);
      }
    } catch (error) {
      console.error('Error fetching parts:', error);
      setParts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllCustomers();
      console.log('Customer response:', response); // Debug log
      
      // Handle response based on its structure
      if (response && typeof response === 'object') {
        const customerResp = response as CustomerResponse | Customer[];
        if (Array.isArray(customerResp)) {
          setCustomers(customerResp);
        } else if (customerResp.data && Array.isArray(customerResp.data)) {
          setCustomers(customerResp.data);
        } else if (customerResp.customers && Array.isArray(customerResp.customers)) {
          setCustomers(customerResp.customers);
        } else {
          console.error('Unexpected customer data structure:', response);
          setCustomers([]);
        }
      } else {
        console.error('Invalid customer data received:', response);
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: PartFormData) => {
    try {
      // Clean up empty documents
      const cleanedData = {
        ...formData,
        documents: formData.documents.filter(doc => doc.trim() !== ''),
        quantityPerScrew: Number(formData.quantityPerScrew),
        processSteps: formData.processSteps.map(step => ({
          ...step,
          toolsMaterials: step.toolsMaterials.filter(tool => tool.trim() !== '')
        }))
      };

      // Fixed: Use VITE_API_URL instead of REACT_APP_API_URL
      const url = editingPartId 
        ? `${import.meta.env.VITE_API_URL}/api/engineer/${editingPartId}`
        : `${import.meta.env.VITE_API_URL}/api/engineer`;

      const response = await fetch(url, {
        method: editingPartId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(cleanedData)
      });

      if (response.ok) {
        alert(editingPartId ? 'Part updated successfully!' : 'Part created successfully!');
        fetchParts(); // Refresh the parts list
        setShowForm(false); // Hide the form
        setEditingPartId(null); // Clear editing state
        setInitialFormData(undefined); // Clear initial data
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to save part'}`);
      }
    } catch (error) {
      console.error('Error saving part:', error);
      alert('Error saving part. Please try again.');
    }
  };

  const handleEdit = (part: Part) => {
    setShowForm(true);
    setEditingPartId(part._id);
    setInitialFormData({
      partNumber: part.partNumber,
      description: part.description || '',
      customer: part.customer._id,
      documents: part.documents.length > 0 ? part.documents : [''],
      rawMaterial: part.rawMaterial,
      quantityPerScrew: part.quantityPerScrew.toString(),
      processSteps: part.processSteps
    });
  };

  const handleCreateNew = () => {
    setShowForm(true);
    setEditingPartId(null);
    setInitialFormData(undefined);
  };

  const handleViewList = () => {
    setShowForm(false);
    setEditingPartId(null);
    setInitialFormData(undefined);
  };

  // Ensure customers and materials are always arrays
  const safeCustomers = Array.isArray(customers) ? customers : [];
  const safeMaterials = Array.isArray(materials) ? materials : [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white min-h-screen">
        <div className="p-4">
          <h1 className="text-xl font-bold">Manufacturing Dashboard</h1>
          <p className="text-gray-400 text-sm">Engineer Portal</p>
        </div>
        <nav className="mt-6">
          <NavLink 
            to="/engineer" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink 
            to="/engineer/parts" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <Package className="w-5 h-5 mr-3" />
            Parts Management
          </NavLink>
          <NavLink 
            to="/engineer/documents" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <FileText className="w-5 h-5 mr-3" />
            Documents
          </NavLink>
          <NavLink 
            to="/engineer/profile" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <User className="w-5 h-5 mr-3" />
            Profile
          </NavLink>
          <NavLink 
            to="/engineer/settings" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </NavLink>
          <NavLink 
            to="/logout" 
            className="flex items-center p-4 hover:bg-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </NavLink>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default EngineerDashboard;
