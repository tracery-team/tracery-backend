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
  BadRequestException,
} from '@nestjs/common'
import { EventService } from './event.service'
import { AuthGuard, AuthorizedRequest } from '../auth/auth.guard'

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
  async addEvent(
    @Request() request: AuthorizedRequest,
    @Body('eventId') eventId: number,
  ) {
    const userId = request.parsedToken.sub

    const result = await this.eventService.addEvent(userId, eventId)

    if (result) {
      return { message: 'Event added successfully' }
    } else {
      throw new BadRequestException('Could not add event')
    }
  }

  @Delete('remove')
  @UseGuards(AuthGuard)
  async removeEvent(
    @Request() request: AuthorizedRequest,
    @Body('eventId') eventId: number,
  ) {
    const userId = request.parsedToken.sub

    const result = await this.eventService.removeEvent(userId, eventId)

    if (result) {
      return { message: 'Event removed successfully' }
    } else {
      throw new BadRequestException('Could not remove event')
    }
  }

  @Get(':id')
  async getEventById(@Param('id') id: number) {
    return await this.eventService.getEventById(id)
  }
}
