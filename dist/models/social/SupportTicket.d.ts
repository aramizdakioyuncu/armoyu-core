import { User } from '../auth/User';
/**
 * Represents a Support Ticket in the armoyu platform.
 */
export declare class SupportTicket {
    id: string;
    subject: string;
    category: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
    lastMessage: string;
    author?: User;
    constructor(data: Partial<SupportTicket>);
    /**
     * Instantiates a SupportTicket object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): SupportTicket;
}
