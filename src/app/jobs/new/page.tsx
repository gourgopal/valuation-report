'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewJobPage() {
  const router = useRouter();

  useEffect(() => {
    // Generate a random ID and redirect to the job execution page
    const newId = `VAL-NEW-${Math.floor(Math.random() * 10000)}`;
    router.replace(`/jobs/${newId}`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-slate-500 font-medium">Creating Workspace...</div>
    </div>
  );
}
