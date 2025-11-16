import {fetchHealth} from '@/api/health';

export default async function DashboardPage() {
  const health = await fetchHealth();

  return (
    <main className="min-h-screen p-8 font-sans">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <pre className="bg-slate-100 p-4 rounded mt-4 text-sm">{JSON.stringify(health, null, 2)}</pre>
    </main>
  );
}
