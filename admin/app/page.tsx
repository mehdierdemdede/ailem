import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen p-8 font-sans">
      <h1 className="text-2xl font-bold">AilePlus Admin</h1>
      <p className="text-neutral-600 mt-2">Clean architecture scaffold with typed config and API client.</p>
      <Link className="text-blue-600 underline mt-4 inline-block" href="/dashboard">
        Go to dashboard
      </Link>
    </main>
  );
}
