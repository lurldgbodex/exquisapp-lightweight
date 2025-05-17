import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventHandlers } from './events/event.handlers';

@Injectable()
export class NotificationService implements OnModuleInit {
    constructor(private readonly eventHandlers: EventHandlers) {}

    async onModuleInit() {
        await this.eventHandlers.initializeEventListeners();
    }
}
