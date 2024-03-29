export interface Project {
  id: number;
  name: string;
  description: string;
  country: string;
  region: string;
  budget: number;
  totalCost: number;
  isConfidential: boolean;
  status: string;
  isEditable: boolean;
  userId: number;
  businessCategory: string;
  departmentId: number;
  currencyId: number;
  nda?: {
    text: string;
  };
}
