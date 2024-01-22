import { Either, left, right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answer-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentRepository } from '../repositories/answer-attachment-repository';

interface EditAnswerUseCaseRequest {
   authorId: string
   answerId: string
   content: string
   attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
   ResourceNotFoundError | NotAllowedError,
   {
      answer: Answer
   }
>

export class EditAnswerUseCase {
   constructor(
      private answerRepository: AnswersRepository,
      private answerAttachmentsRepository: AnswerAttachmentRepository
   ) { }
   async execute({
      authorId,
      answerId,
      content,
      attachmentsIds,
   }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
      const answer = await this.answerRepository.findById(answerId)

      if (!answer) {
         return left(new ResourceNotFoundError())
      }

      if (authorId !== answer.authorId.toString()) {
         return left(new NotAllowedError())
      }

      const currentAnswerAttachments = 
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

      const answerAttachmentList = new AnswerAttachmentList(
         currentAnswerAttachments
      )

      const answerAttachments = attachmentsIds.map(attachmentId => {
         return AnswerAttachment.create({
            attachmentId: new UniqueEntityId(attachmentId),
            answerId: answer.id
         })
      })

      answerAttachmentList.update(answerAttachments)


      answer.content = content
      answer.attachments = answerAttachmentList

      await this.answerRepository.create(answer)

      return right({
         answer,
      })
   }
}