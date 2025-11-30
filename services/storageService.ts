import { AutomationRequest, RequestStatus, Priority } from '../types';

const STORAGE_KEY = 'revit_automation_requests';

// Seed data to show on first load
const SEED_DATA: AutomationRequest[] = [
  {
    id: 'req_1',
    title: 'Auto-Dimension Walls in View',
    requesterName: 'Alice Architect',
    requesterId: 'user_arch',
    projectName: 'Tower A - Schematic',
    revitVersion: '2024',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    description: 'I need a script that places aligned dimensions on all wall faces in the active view. It should prioritize core faces.',
    priority: Priority.HIGH,
    status: RequestStatus.PENDING,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    attachments: []
  },
  {
    id: 'req_2',
    title: 'Export Sheets to PDF',
    requesterName: 'Alice Architect', // Assuming Alice submitted this for consistency
    requesterId: 'user_arch',
    projectName: 'Hospital Block B',
    revitVersion: '2023',
    description: 'Automate the export of all sheets containing "Fire" in the name to PDF. Naming convention: Sheet Number - Sheet Name.',
    priority: Priority.MEDIUM,
    status: RequestStatus.IN_PROGRESS,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
    attachments: []
  },
  {
    id: 'req_3',
    title: 'Bulk Rename Families',
    requesterName: 'Bob Builder',
    requesterId: 'user_bob', // A user not in the mock login list, but exists in data
    projectName: 'City Center Mall',
    revitVersion: '2025',
    description: 'We need to add a prefix "ACM_" to all generic models in the project.',
    priority: Priority.LOW,
    status: RequestStatus.COMPLETED,
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 5,
    resultScript: "import clr\n# Script content...",
    attachments: []
  }
];

export const getRequests = (): AutomationRequest[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(data);
};

export const saveRequest = (request: AutomationRequest): void => {
  const requests = getRequests();
  const existingIndex = requests.findIndex(r => r.id === request.id);
  
  if (existingIndex >= 0) {
    requests[existingIndex] = request;
  } else {
    requests.unshift(request);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};

export const deleteRequest = (id: string): void => {
  const requests = getRequests().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};