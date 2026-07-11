import Dexie, { type EntityTable } from 'dexie';

export interface Job {
  id: string;
  templateId: string;
  data: any; // Dynamic Form JSON
  status: 'Draft' | 'In Progress' | 'Ready for Review' | 'Completed';
  createdAt: number;
  updatedAt: number;
}

export interface SyncQueue {
  id: string;
  action: 'UPSERT_JOB' | 'UPLOAD_IMAGE';
  payload: any;
  createdAt: number;
}

export interface Template {
  id: string;
  name: string;
  schema: any; // Dynamic schema
}

const db = new Dexie('ValuationDB') as Dexie & {
  jobs: EntityTable<Job, 'id'>;
  syncQueue: EntityTable<SyncQueue, 'id'>;
  templates: EntityTable<Template, 'id'>;
};

db.version(1).stores({
  jobs: 'id, templateId, status, updatedAt',
  syncQueue: 'id, action, createdAt',
  templates: 'id'
});

export { db };
