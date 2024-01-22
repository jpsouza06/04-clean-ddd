import { Either, left, right } from '@/core/either'
import { AnswerCommentRepository } from '../repositories/answer-comments-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/erros/errors/not-allowed-error'

interface DeleteAnswerCommentUseCaseRequest {
   authorId: string
   answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
   ResourceNotFoundError | NotAllowedError,
   {}
>

export class DeleteAnswerCommentUseCase {
   constructor(
      private answerCommentRepository: AnswerCommentRepository
   ) { }
   async execute(
      {
         authorId,
         answerCommentId,

      }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
      const answerComment = await this.answerCommentRepository.findById(answerCommentId)

      if (!answerComment) {
         return left(new ResourceNotFoundError())
      }

      if (answerComment.authorId.toString() !== authorId) {
         return left(new NotAllowedError())
      }

      await this.answerCommentRepository.delete(answerComment)

      return right({})
   }
}