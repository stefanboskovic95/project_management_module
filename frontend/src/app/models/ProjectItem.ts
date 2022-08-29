export interface ProjectItem {
  id: number;
  name: string;
  subject: string;
  cost: number;
  isNdaSigned: boolean;
  completedAt: Date;
  status: string;
  projectId: number;
  userId: number;
}
