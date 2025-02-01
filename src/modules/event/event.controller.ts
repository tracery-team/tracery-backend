import { Controller, Get, Query } from '@nestjs/common'
import { EventService } from './event.service'

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async searchEvents(
    @Query('page') page: number = 1,
    @Query('search') search?: string,
  ) {
    const events = await this.eventService.searchEvents(page, search)

    return events
  }
}
