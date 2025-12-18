import { apiFetch } from '@/lib/http';

type HealthResponse = {
  status: string;
  timestamp: string;
};

export const fetchHealth = async (): Promise<HealthResponse> => {
  return apiFetch<HealthResponse>('/health');
};
