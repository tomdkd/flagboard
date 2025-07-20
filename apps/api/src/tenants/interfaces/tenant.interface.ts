export default interface Tenant {
  id: number;
  uuid: string;
  name: string;
  legal_name?: string | null;
  siret?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
  phone?: string | null;
  website?: string | null;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}