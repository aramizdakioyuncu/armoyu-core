export interface EventOrganizer {
    id: number;
    displayName: string;
    avatar: string;
}
/**
 * Represents an ARMOYU platform event (tournament, meeting, etc.)
 */
export declare class ArmoyuEvent {
    id: number;
    name: string;
    status: number;
    link: string;
    thumbnail: string;
    image?: string;
    gameId: number;
    gameName: string;
    gameLogo: string;
    gameBanner: string;
    organizers: EventOrganizer[];
    type: string;
    date: string;
    participantType: string;
    participantLimit: number;
    groupPlayerLimit: number;
    currentParticipants: number;
    location: string;
    description: string;
    rules: string;
    constructor(data: Partial<ArmoyuEvent>);
    /**
     * Instantiates an ArmoyuEvent object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): ArmoyuEvent;
    /**
     * Checks if the event has space for more participants.
     */
    hasSpace(): boolean;
    /**
     * Returns a formatted progress string for participants (e.g. "12/16").
     */
    getParticipantProgress(): string;
}
