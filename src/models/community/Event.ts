export class ArmoyuEvent {
  id: string = '';
  title: string = '';
  status: string = '';
  banner: string = '';
  date: string = '';
  location: string = '';
  participantLimit: number = 0;
  currentParticipants: number = 0;
  description: string = '';
  rules: string[] = [];
  admins: any[] = [];
  game: string = '';
  rewards: string = '';
  isHot: boolean = false;
  isLive: boolean = false;
  participants: any[] = []; // Array of participant objects/userslf
  participationType: 'INDIVIDUAL' | 'GROUP' | 'BOTH' = 'INDIVIDUAL';
  minODP: number = 0; // Minimum score required to join
  hasStats: boolean = false; // Whether to show statistics tab
  template: 'STANDARD' | 'TOURNAMENT' | 'TRAINING' = 'STANDARD';
  teams: any[] = []; // List of teams for tournament template
  leaderboard: any[] = []; // List of top performers

  constructor(data: Partial<ArmoyuEvent>) {
    Object.assign(this, data);
  }

  static fromJSON(json: any): ArmoyuEvent {
    return new ArmoyuEvent(json);
  }
}
