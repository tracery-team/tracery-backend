import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EventEntity } from 'src/data/event.entity'
import { applySearch, levenshtein } from 'src/levenshtein'
import { PAGE_SIZE } from 'src/constants'

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
}
