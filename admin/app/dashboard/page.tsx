import { fetchHealth } from '@/api/health';
import { fetchFamilies } from '@/api/families';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  const [health, families] = await Promise.all([
    fetchHealth(),
    fetchFamilies()
  ]);

  return <DashboardClient initialFamilies={families} health={health} />;
}
