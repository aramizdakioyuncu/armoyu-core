export interface LeagueStandingResponse {
  rank: number;
  teamName: string;
  logo: string | null;
  played: number;
  average: number;
  points: number;
}
