// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'Admin' | 'Manager' | 'Sales Rep';
  tenant: string;
  tenant_name: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  company_name: string;
  username: string;
  email: string;
  password: string;
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  tags: string[];
  assigned_to: string | null;
  assigned_to_name: string | null;
  activities?: Activity[];
  created_at: string;
  updated_at?: string;
}

export interface ContactFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  tags?: string[];
  assigned_to?: string | null;
}

// ─── Activities ──────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  contact: string;
  author: string | null;
  author_name: string;
  activity_type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  description: string;
  created_at: string;
}

// ─── Deals ───────────────────────────────────────────────────────────────────

export type DealStage = 'Lead' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export interface Deal {
  id: string;
  contact: string;
  contact_name: string;
  assigned_to: string | null;
  assigned_to_name: string | null;
  title: string;
  amount: string; // DecimalField comes as string
  stage: DealStage;
  probability: number;
  created_at: string;
  updated_at?: string;
}

export interface DealFormData {
  contact: string;
  title: string;
  amount: number;
  stage: DealStage;
  probability: number;
  assigned_to?: string | null;
}

// ─── Tickets ─────────────────────────────────────────────────────────────────

export type TicketStatus = 'Open' | 'Pending' | 'Resolved';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface TicketNote {
  id: string;
  ticket: string;
  author: string | null;
  author_name: string;
  body: string;
  is_internal: boolean;
  created_at: string;
}

export interface Ticket {
  id: string;
  contact: string;
  contact_name: string;
  assigned_to: string | null;
  assigned_to_name: string | null;
  subject: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  notes?: TicketNote[];
  created_at: string;
  updated_at?: string;
}

export interface TicketFormData {
  contact: string;
  subject: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigned_to?: string | null;
}

// ─── Pipeline Summary ────────────────────────────────────────────────────────

export interface PipelineStageSummary {
  stage: DealStage;
  count: number;
  total_value: string;
}
