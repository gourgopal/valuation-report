'use client';
import { useSyncManager } from '@/hooks/useSyncManager';
import { ReactNode } from 'react';

export function SyncProvider({ children }: { children: ReactNode }) {
  // Mounts the global sync observer
  useSyncManager();
  
  return <>{children}</>;
}
