import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityId } from "../entities/unique-entity-id";
import { DomainEvent } from './domain-event'
import { DomainEvents } from "./domain-events";

import {vi} from 'vitest'

class CurstomAggregateCreate implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
      return this.aggregate.id
  }
} 

class CustomAggregate extends AggregateRoot<any> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CurstomAggregateCreate(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
      const callbackSpy = vi.fn()

      DomainEvents.register(callbackSpy, CurstomAggregateCreate.name)

      const aggregate = CustomAggregate.create()

      expect(aggregate.domainEvents).toHaveLength(1)

      DomainEvents.dispatchEventsForAggregate(aggregate.id)

      expect(callbackSpy).toHaveBeenCalled()
  })
})