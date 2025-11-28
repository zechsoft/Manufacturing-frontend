import React, { useEffect, useState } from "react";
import { getAllPlans, deletePlan } from "../../services/planningApi";
import NewPlanModal from "../../components/planning/NewPlanModal";
import toast from "react-hot-toast";

interface Plan {
  _id: string;
  machineType: string;
  partNumber: string;
  timeDuration?: string;
  status?: string;
  createdAt?: string;
}

export default function PlanningManagement() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [query, setQuery] = useState("");

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const resp = await getAllPlans(query);
      if (resp?.success) setPlans(resp.plans || []);
      else setPlans([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line
  }, []);

  const handleCreated = () => fetchPlans();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    try {
      const resp = await deletePlan(id);
      if (resp?.success) {
        toast.success("Plan deleted");
        fetchPlans();
      } else {
        toast.error(resp?.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Planning Management</h1>
        <p className="text-gray-600">Plan and track production tasks efficiently</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow-sm">
          <p className="text-sm text-gray-500">Total Plans</p>
          <p className="text-2xl font-bold">{plans.length}</p>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <p className="text-sm text-gray-500">Active Plans</p>
          <p className="text-2xl font-bold">{plans.filter(p => p.status === "in_progress").length}</p>
        </div>

        {/* two placeholder cards to keep layout consistent */}
        {/* <div className="bg-white p-4 rounded shadow-sm hidden lg:block"></div>
        <div className="bg-white p-4 rounded shadow-sm hidden lg:block"></div> */}
      </div>

      <div className="bg-white p-4 rounded shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <input
            placeholder="Search plans..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded border px-3 py-2"
          />
          {/* <button onClick={() => fetchPlans()} className="px-4 py-2 bg-gray-200 rounded">Filter</button> */}
          <button onClick={() => setOpenModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded">+ New Plan</button>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm">
        <table className="w-full">
          <thead className="text-left border-b">
            <tr>
              <th className="p-4">Plan ID</th>
              <th className="p-4">Part Number</th>
              <th className="p-4">Machine Type</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>
            ) : plans.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center">No plans found.</td></tr>
            ) : (
              plans.map(plan => (
                <tr key={plan._id} className="border-b">
                  <td className="p-4 font-mono text-sm">{plan._id.slice(-8)}</td>
                  <td className="p-4">{plan.partNumber}</td>
                  <td className="p-4">{plan.machineType}</td>
                  <td className="p-4">{plan.timeDuration || "-"}</td>
                  <td className="p-4">{plan.status || "planned"}</td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => alert(JSON.stringify(plan, null, 2))} className="text-blue-600">View</button>
                      <button onClick={() => setOpenModal(true) /* you can set selectedPlan to edit later */} className="text-green-600">Edit</button>
                      <button onClick={() => handleDelete(plan._id)} className="text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <NewPlanModal open={openModal} onClose={() => setOpenModal(false)} onCreated={handleCreated} />
    </div>

  );

}
