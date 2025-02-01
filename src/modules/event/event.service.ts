import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EventEntity } from 'src/data/event.entity'
import { levenshtein } from 'src/levenshtein'
const PAGE_SIZE = 10

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  async searchEvents(page: number, search?: string): Promise<EventEntity[]> {
    const skipPage = (page - 1) * PAGE_SIZE

    const events = await this.eventRepository.find()

    if (!search) {
      return events.slice(skipPage, skipPage + PAGE_SIZE)
    }

    const filteredEvents = events
      .map(event => {
        const eventEntity = { ...event }
        const nameDistance = levenshtein(
          search.toLowerCase(),
          event.title.toLowerCase(),
        )

        const dateDistance = levenshtein(
          search.toLowerCase(),
          event.date.toISOString().toLowerCase(),
        )

        const minDistance = Math.min(nameDistance, dateDistance)

        const eventWithDistance = {
          ...eventEntity,
          distance: minDistance,
        }

        return eventWithDistance
      })
      .filter(event => event.distance <= 2)
      .sort((a, b) => a.distance - b.distance)

    const paginatedEvents = filteredEvents.slice(skipPage, skipPage + PAGE_SIZE)

    return paginatedEvents
  }
}
