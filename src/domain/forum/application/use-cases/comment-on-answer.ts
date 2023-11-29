import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswersRepository } from '../repositories/answer-repository';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentRepository } from '../repositories/answer-comments-repository';

interface CommentOnAnswerUseCaseRequest {
   authorId: string
   answerId: string
   content: string
}

interface CommentOnAnswerUseCaseResponse {
   answerComment: AnswerComment
}

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
         throw new Error('Answernot found.')
      }

      const answerComment = AnswerComment.create({
         authorId: new UniqueEntityId(authorId),
         answerId: new UniqueEntityId(answerId),
         content
      })

      await this.answerCommentRepository.create(answerComment)

      return {
         answerComment,
      }
   }
}