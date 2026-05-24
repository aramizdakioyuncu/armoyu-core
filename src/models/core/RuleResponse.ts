export interface RuleResponse {
  id: number;
  content: string;
  penalty?: string;
  penaltySeconds?: number;
  date?: string;
  subRule?: string | null;
  title?: string;
  order?: number;
}
