export interface Project {
  id: number;
  name: string;
  description: string;
  region: string;
  budget: number;
  totalCost: number;
  isConfidential: boolean;
  projectStatusId: number;
  isEditable: boolean;
  userId: number;
  businessCategoryId: number;
  departmentId: number;
  currencyId: number;
  regionId: number;
}