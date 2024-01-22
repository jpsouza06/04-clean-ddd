import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswersRepository } from '../repositories/answer-repository';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentRepository } from '../repositories/answer-comments-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';

interface CommentOnAnswerUseCaseRequest {
   authorId: string
   answerId: string
   content: string
}

type CommentOnAnswerUseCaseResponse = Either<
   ResourceNotFoundError,
   {
      answerComment: AnswerComment
   }
>

export class CommentOnAnswerUseCase {
   constructor(
      private answerRepository: AnswersRepository,
      private answerCommentRepository: AnswerCommentRepository
   ) { }
   async execute(
      {
         authorId,
         answerId,
         content
      }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
      const answer = await this.answerRepository.findById(answerId)

      if (!answer) {
         return left(new ResourceNotFoundError())
      }

      const answerComment = AnswerComment.create({
         authorId: new UniqueEntityId(authorId),
         answerId: new UniqueEntityId(answerId),
         content
      })

      await this.answerCommentRepository.create(answerComment)

      return right({
         answerComment,
      })
   }
}