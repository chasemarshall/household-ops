export type Role = 'admin' | 'member'
export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'other'
export type SubscriptionCategory = 'streaming' | 'meal_kit' | 'utility' | 'other'
export type MaintenanceCategory = 'home' | 'vehicle' | 'health' | 'other'
export type OrderType = 'recurring' | 'one_time'
export type OrderFrequency = 'weekly' | 'biweekly' | 'monthly'
export type OrderStatus = 'upcoming' | 'ordered' | 'shipped' | 'delivered' | 'recurring'
export type InventoryCategory = 'grocery' | 'household' | 'personal' | 'other'
export type DocumentType = 'warranty' | 'manual' | 'insurance' | 'lease' | 'other'

export interface Household {
  id: string
  name: string
  created_at: string
}

export interface Profile {
  id: string
  household_id: string
  display_name: string
  role: Role
  avatar_color: string
  created_at: string
}

export interface Subscription {
  id: string
  household_id: string
  created_by: string | null
  name: string
  category: SubscriptionCategory
  cost: number | null
  billing_cycle: BillingCycle
  next_renewal_date: string | null
  auto_renews: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface MaintenanceItem {
  id: string
  household_id: string
  created_by: string | null
  name: string
  category: MaintenanceCategory
  interval_days: number
  last_completed: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Bill {
  id: string
  household_id: string
  created_by: string | null
  name: string
  amount: number | null
  due_date: string
  paid: boolean
  paid_date: string | null
  recurring: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  household_id: string
  created_by: string | null
  name: string
  type: OrderType
  next_delivery_date: string | null
  frequency: OrderFrequency | null
  status: OrderStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  household_id: string
  person_id: string | null
  name: string
  event_description: string | null
  event_date: string | null
  amount_due: number | null
  paid: boolean
  notes: string | null
  created_at: string
  updated_at: string
  person?: Profile
}

export interface InventoryItem {
  id: string
  household_id: string
  created_by: string | null
  name: string
  quantity: string | null
  category: InventoryCategory
  always_needed: boolean
  checked: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  household_id: string
  created_by: string | null
  name: string
  type: DocumentType
  associated_item: string | null
  expiry_date: string | null
  link: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Invite {
  id: string
  household_id: string
  email: string | null
  token: string
  used: boolean
  created_at: string
}
