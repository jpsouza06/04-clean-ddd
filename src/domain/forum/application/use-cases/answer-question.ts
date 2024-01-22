import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from '../repositories/answer-repository'
import { Either, right } from "@/core/either"
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment"
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list"

interface AnswerQuestionUseCaseRequest {
   instrucionId: string
   questionId: string
   attachmentsIds: string[]
   content: string
}

type AnswerQuestionUseCaseResponse = Either<
   null,
   {
      answer: Answer
   }
>

export class AnswerQuestionUseCase {
   constructor(
      private answersRepository: AnswersRepository,
   ) { }
   async execute(
      {
         instrucionId,
         questionId,
         attachmentsIds,
         content
      }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
      const answer = Answer.create({
         content,
         authorId: new UniqueEntityId(instrucionId),
         questionId: new UniqueEntityId(questionId),
      })

      const answerAttachments = attachmentsIds.map(attachmentId => {
         return AnswerAttachment.create({
            attachmentId: new UniqueEntityId(attachmentId),
            answerId: answer.id
         })
      })

      answer.attachments = new AnswerAttachmentList(answerAttachments)

      await this.answersRepository.create(answer)

      return right({
         answer
      })
   }
}