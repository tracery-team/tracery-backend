import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EventEntity } from 'src/data/event.entity'
import { UserEntity } from 'src/data/user.entity'
import { applySearch, levenshtein } from 'src/levenshtein'
import { PAGE_SIZE } from 'src/constants'

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

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
