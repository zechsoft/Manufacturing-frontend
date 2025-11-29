import React, { useState } from "react";
import { createPlan } from "../../services/planningapi";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  initialData?: any;
}

export default function NewPlanModal({ open, onClose, onCreated, initialData }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    machineType: initialData?.machineType || "",
    rawMaterials: initialData?.rawMaterials || "",
    manPower: initialData?.manPower || 0,
    partNumber: initialData?.partNumber || "",
    timeDuration: initialData?.timeDuration || "",
    tooling: initialData?.tooling || "",
    machineAvailability: initialData?.machineAvailability || "",
    shiftTimings: initialData?.shiftTimings || ""
  });

  React.useEffect(() => {
    if (initialData) setForm({ ...form, ...initialData });
    // eslint-disable-next-line
  }, [initialData]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "manPower" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.machineType || !form.partNumber) {
      toast.error("Machine type and Part number are required");
      return;
    }
    setLoading(true);
    try {
      const resp = await createPlan(form);
      if (resp?.success) {
        toast.success("Plan created");
        onCreated && onCreated();
        onClose();
      } else {
        toast.error(resp?.message || "Failed to create plan");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black opacity-40" onClick={() => !loading && onClose()} />
      <div className="relative w-full max-w-3xl bg-white rounded shadow-lg overflow-auto" style={{ maxHeight: "90vh" }}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Create New Plan</h2>
          <button onClick={() => !loading && onClose()} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type of Machine</label>
              <input name="machineType" value={form.machineType} onChange={handleChange} className="mt-1 block w-full rounded border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Part Number</label>
              <input name="partNumber" value={form.partNumber} onChange={handleChange} className="mt-1 block w-full rounded border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Man Power Required</label>
              <input name="manPower" type="number" value={form.manPower} onChange={handleChange} className="mt-1 block w-full rounded border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time Duration</label>
              <input name="timeDuration" value={form.timeDuration} onChange={handleChange} placeholder="e.g. 2h 30m" className="mt-1 block w-full rounded border px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Raw Materials Required</label>
            <textarea name="rawMaterials" value={form.rawMaterials} onChange={handleChange} rows={3} className="mt-1 block w-full rounded border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tooling</label>
            <textarea name="tooling" value={form.tooling} onChange={handleChange} rows={2} className="mt-1 block w-full rounded border px-3 py-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Machine Availability</label>
              <input name="machineAvailability" value={form.machineAvailability} onChange={handleChange} className="mt-1 block w-full rounded border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Shift Timings</label>
              <input name="shiftTimings" value={form.shiftTimings} onChange={handleChange} className="mt-1 block w-full rounded border px-3 py-2" placeholder="e.g. Shift A (9:00-17:00)" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white">
              {loading ? "Saving..." : "Save Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
