import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/paginations-params";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachment-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answer-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
   public items: Answer[] = []

   constructor(
      private answerAttachmentsRepository: AnswerAttachmentRepository,
   ) {}

   async findById(id: string) {
      const answer = this.items.find((item) => item.id.toString() === id)

      if (!answer) {
         return null
      }

      return answer
   }

   async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
      const answers = this.items
         .filter(item => item.questionId.toString() === questionId)
         .slice((page - 1) * 20, page * 20)

      return answers
   }

   async save(answer: Answer) {
      const itemIndex = this.items.findIndex((item) => item.id === answer.id)

      this.items[itemIndex] = answer

      DomainEvents.dispatchEventsForAggregate(answer.id)
   }

   async create(answer: Answer) {
      this.items.push(answer)

      DomainEvents.dispatchEventsForAggregate(answer.id)
   }

   async delete(answer: Answer) {
      const itemIndex = this.items.findIndex((item) => item.id === answer.id)

      this.items.splice(itemIndex, 1)

      this.answerAttachmentsRepository.deleteManyByQuesitonId(answer.id.toString())
   }
}