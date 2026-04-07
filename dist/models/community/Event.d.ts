export declare class ArmoyuEvent {
    id: string;
    title: string;
    status: string;
    banner: string;
    date: string;
    location: string;
    participantLimit: number;
    currentParticipants: number;
    description: string;
    rules: string[];
    admins: any[];
    game: string;
    rewards: string;
    isHot: boolean;
    isLive: boolean;
    participants: any[];
    participationType: 'INDIVIDUAL' | 'GROUP' | 'BOTH';
    minODP: number;
    hasStats: boolean;
    template: 'STANDARD' | 'TOURNAMENT' | 'TRAINING';
    teams: any[];
    leaderboard: any[];
    constructor(data: Partial<ArmoyuEvent>);
    static fromJSON(json: any): ArmoyuEvent;
}
