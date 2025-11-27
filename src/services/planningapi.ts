// planningApi.ts
export interface PlanPayload {
  machineType: string;
  rawMaterials?: string;
  manPower?: number;
  partNumber: string;
  timeDuration?: string;
  tooling?: string;
  machineAvailability?: string;
  shiftTimings?: string;
  status?: string;
}

export interface Plan {
  _id: string;
  machineType: string;
  rawMaterials?: string;
  manPower?: number;
  partNumber: string;
  timeDuration?: string;
  tooling?: string;
  machineAvailability?: string;
  shiftTimings?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

const BASE = `${import.meta.env.VITE_API_URL}/api/planning`;

export async function getAllPlans(q?: string) {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  const res = await fetch(`${BASE}/plans${qs}`, {
    credentials: "include"
  });
  return res.json();
}

export async function createPlan(payload: PlanPayload) {
  const res = await fetch(`${BASE}/plans`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updatePlan(id: string, payload: Partial<PlanPayload>) {
  const res = await fetch(`${BASE}/plans/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deletePlan(id: string) {
  const res = await fetch(`${BASE}/plans/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}
