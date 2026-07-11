'use client';
import { useSearchParams } from 'next/navigation';
import { JobExecutionClient } from './JobExecutionClient';

export default function WorkspaceWrapper() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 'VAL-NEW-0000';
  
  return <JobExecutionClient jobId={id} />;
}
