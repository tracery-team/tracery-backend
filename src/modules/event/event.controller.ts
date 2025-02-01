import {
  Controller,
  Get,
  Query,
  Post,
  Delete,
  UseGuards,
  Request,
  Body,
  Param,
} from '@nestjs/common'
import { EventService } from './event.service'
import { AuthGuard } from '../auth/auth.guard'

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

  @Post('add')
  @UseGuards(AuthGuard)
  async addEvent(@Request() request, @Body() eventId: number) {
    const userId = request.user.sub

    const result = await this.eventService.addEvent(userId, eventId)

    if (result) {
      return { message: 'Event added successfully' }
    } else {
      throw new Error('Could not add event')
    }
  }

  @Delete('remove/:id')
  @UseGuards(AuthGuard)
  async removeEvent(@Request() request, @Param('id') eventId: number) {
    const userId = request.user.sub

    const result = await this.eventService.removeEvent(userId, eventId)

    if (result) {
      return { message: 'Event removed successfully' }
    } else {
      throw new Error('Could not remove event')
    }
  }
}
