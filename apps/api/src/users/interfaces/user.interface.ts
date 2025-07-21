export default interface User {
  id: number;
  tenant_id: number;
  name: string;
  email: string;
  password: string;
  is_active: boolean,
  created_at: Date | string;
  updated_at: Date | string;
}