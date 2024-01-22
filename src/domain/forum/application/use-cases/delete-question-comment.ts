import { Either, left, right } from '@/core/either'
import { QuestionCommentRepository } from '../repositories/question-comments-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/erros/errors/not-allowed-error'

interface DeleteQuestionCommentUseCaseRequest {
   authorId: string
   questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
   ResourceNotFoundError | NotAllowedError,
   {}
>

export class DeleteQuestionCommentUseCase {
   constructor(
      private questionCommentRepository: QuestionCommentRepository
   ) { }
   async execute(
      {
         authorId,
         questionCommentId,

      }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
      const questionComment = await this.questionCommentRepository.findById(questionCommentId)

      if (!questionComment) {
         return left(new ResourceNotFoundError())
      }

      if (questionComment.authorId.toString() !== authorId) {
         return left(new NotAllowedError())
      }

      await this.questionCommentRepository.delete(questionComment)

      return right({})
   }
}