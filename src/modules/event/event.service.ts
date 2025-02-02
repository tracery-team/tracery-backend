import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EventEntity } from 'src/data/event.entity'
import { UserEntity } from 'src/data/user.entity'
import { applySearch, levenshtein } from 'src/levenshtein'
import { PAGE_SIZE } from 'src/constants'
import { plainToInstance } from 'class-transformer'
import { EventDto } from 'src/data/event.dto'

/**
 * Service that handles event-related business logic.
 *
 * This service provides methods for managing events, such as adding, removing, searching,
 * and retrieving events. It interacts with the `EventEntity` and `UserEntity` repositories
 * to fetch and manipulate data in the database.
 *
 * @service EventService
 */
@Injectable()
export class EventService {
  /**
   * Creates an instance of `EventService`.
   *
   * This constructor injects the necessary repositories for managing events and users.
   * The `eventRepository` is used for event-related operations, while the `userRepository`
   * is used to interact with the users' data.
   *
   * @param {Repository<EventEntity>} eventRepository - Repository for managing events.
   * @param {Repository<UserEntity>} userRepository - Repository for managing user data.
   */
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<EventDto[]> {
    const events = await this.eventRepository.find({ relations: ['users'] })
    return plainToInstance(EventDto, events, { excludeExtraneousValues: true })
  }

  async findOne(id: number): Promise<EventDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['users'],
    })
    return plainToInstance(EventDto, event, { excludeExtraneousValues: true })
  }

  /**
   * Searches for friends based on a search term, with pagination support.
   *
   * This method filters events by their `title` and `date` using the Levenshtein distance algorithm.
   * It returns paginated results, with up to PAGE_SIZE users per page.
   * If no search term is provided, it returns all events for the specified page.
   *
   * @param {number} page - The page number for pagination (default is 1).
   * @param {string} search - The search term used to flter events by title or date (optional).
   * @returns {Promise<EventEntity[]>} - A paginated list of `EventEntity` objects that match the search criteria.
   */
  async searchEvents(page: number, search?: string) {
    const skipPage = (page - 1) * PAGE_SIZE

    const events = await this.eventRepository.find()

    if (!search) {
      return events.slice(skipPage, skipPage + PAGE_SIZE)
    }

    const filteredEvents = applySearch(events, event => {
      const nameDistance = levenshtein(
        search.toLowerCase(),
        event.title.toLowerCase(),
      )
      const dateDistance = levenshtein(
        search.toLowerCase(),
        event.date.toISOString().toLowerCase(),
      )
      return Math.min(nameDistance, dateDistance)
    })

    const paginatedEvents = filteredEvents.slice(skipPage, skipPage + PAGE_SIZE)

    return paginatedEvents
  }

  /**
   * Adds an event to a user's event list.
   *
   * This method attempts to add an event by associating the `eventId` with the
   * `userId`'s event list. It checks if both the user and event exist in the database,
   * and adds the event to the user's list if valid. If the user is already attending
   * the event, it will not be added again. The changes are saved to the database.
   *
   * @param {number} userId - The ID of the user to whom the event will be added.
   * @param {number} eventId - The ID of the event to be added to the user's event list.
   * @returns {Promise<boolean>} - `true` if the event was sucessfully added, `false` otherwise
   */
  async addEvent(userId: number, eventId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['events'],
    })

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    })

    if (!user || !event) {
      return false
    }

    if (user.events.some(existingEvent => existingEvent.id === eventId)) {
      return false
    }

    user.events.push(event)
    await this.userRepository.save(user)

    return true
  }

  /**
   * Removes an event from a user's event list.
   *
   * This method attempts to remove an event by dissociating the `eventId` from the
   * `userId`'s event list. It checks if the user exists in the database, and
   * removes the event from the user's list if valid. The changes are saved to the database.
   *
   * @param {number} userId - The ID of the user from whose event list the event will be removed.
   * @param {number} eventId - The ID of the event to be removed from the user's event list.
   * @returns {Promise<boolean>} - `true` if the event was sucessfully removed, `false` otherwise
   */
  async removeEvent(userId: number, eventId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['events'],
    })

    if (!user) {
      return false
    }

    user.events = user.events.filter(event => event.id !== eventId)

    await this.userRepository.save(user)

    return true
  }

  /**
   * Retrieves an event by its ID.
   *
   * This method attempts to fetch an event from the database using the provided `eventId`.
   * If the event exists, it returns the event. If not, it returns `null`.
   *
   * @param {number} eventId - The ID of the event to be retrieved.
   * @returns {Promise<EventEntity>} - The event if found, `null` otherwise
   */
  async getEventById(eventId: number) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    })

    if (!event) {
      return null
    }

    return event
  }
}
