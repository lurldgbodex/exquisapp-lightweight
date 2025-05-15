export interface UserRegisteredEvent {
    eventType: 'USER_REGISTERED';
    userId: string;
    username: string;
    timestamp: Date;
}

export type UserEvent = UserRegisteredEvent;