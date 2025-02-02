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
import { EventEntity } from 'src/data/event.entity'

/**
 * Controller to handle event-related requests.
 *
 * This controller provides endpoints for searching, adding, removing, and retrieving events.
 * It uses guards for authentication and delegates business logic to the `EventService`.
 *
 * @controller EventController
 */
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * Searches for events with optional pagination and search filters.
   *
   * This endpoint allows users to search for events by title or other attributes using
   * a query parameter `search` and paginate the results using the `page` parameter.
   * If no search term is provided, it returns all events on the specified page.
   *
   * @param {number} page - The page number for pagination (default is 1).
   * @param {string} search - The search term to filter events (optional).
   * @returns {Promise<Event[]} - A list of events matching the search criteria.
   */
  @Get()
  async searchEvents(
    @Query('page') page: number = 1,
    @Query('search') search?: string,
  ) {
    const events = await this.eventService.searchEvents(page, search)

    return events
  }

  /**
   * Adds an event to the user's event list.
   *
   * This endpoint allows an authenticated user to add an event to their list by providing
   * the event ID. The user's authentication is verified via the `AuthGuard`.
   *
   * @param {AuthorizedRequest} request - The authenticated user’s request object.
   * @param {number} eventId - The ID of the event to add.
   * @returns - A message confirming the success or failure of the operation.
   * @throws {BadRequestException} - If the event could not be added.
   */
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

  /**
   * Removes an event from the user's event list.
   *
   * This endpoint allows an authenticated user to remove an event from their list by providing
   * the event ID. The user's authentication is verified via the `AuthGuard`.
   *
   * @param {AuthorizedRequest} request - The authenticated user’s request object.
   * @param {number} eventId - The ID of the event to remove.
   * @returns - A message confirming the success or failure of the operation.
   * @throws {BadRequestException} - If the event could not be removed.
   */
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

  /**
   * Retrieves an event by its ID.
   *
   * This endpoint fetches a single event based on its ID. If the event is found, it returns
   * the event details. If the event does not exist, it returns `null`.
   *
   * @param {number} id - The ID of the event to retrieve.
   * @returns {Promise<EventEntity>} - The event details if found, or null if not.
   */
  @Get(':id')
  async getEventById(@Param('id') id: number) {
    return this.eventService.getEventById(id)
  }
}
