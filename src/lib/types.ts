export type ReservationStatus = "confirmed" | "cancelled" | "completed" | "no_show";
export type WaitlistStatus = "waiting" | "seated" | "left";
export type TableLocation = "indoor" | "outdoor";

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  notes: string | null;
  visit_count: number;
  last_visit_at: string | null;
  created_at: string;
}

export interface RestaurantTable {
  id: string;
  table_number: string;
  capacity: number;
  location: TableLocation;
  created_at: string;
}

export interface Reservation {
  id: string;
  customer_id: string | null;
  table_id: string | null;
  reservation_time: string;
  party_size: number;
  status: ReservationStatus;
  created_at: string;
  status_changed_at: string | null;
}

export interface ReservationWithRelations extends Reservation {
  eficto_customers: Pick<Customer, "id" | "full_name" | "phone"> | null;
  eficto_tables: Pick<RestaurantTable, "id" | "table_number" | "capacity" | "location"> | null;
}

export interface WaitlistEntry {
  id: string;
  customer_id: string | null;
  party_size: number;
  location: TableLocation | "any";
  status: WaitlistStatus;
  joined_at: string;
}

export interface Review {
  id: string;
  customer_id: string | null;
  customer_name: string | null;
  rating: number | null;
  comment: string | null;
  review_date: string | null;
  created_at: string;
}
