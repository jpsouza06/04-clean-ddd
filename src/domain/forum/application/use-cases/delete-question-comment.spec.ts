import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { CommentOnQuestionUseCase } from './comment-on-question';
import { DeleteQuestionCommentUseCase } from './delete-quesiton-comment';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
   beforeEach(() => {
      inMemoryQuestionCommentRepository = new InMemoryQuestionCommentsRepository()
      sut = new DeleteQuestionCommentUseCase(
         inMemoryQuestionCommentRepository,
      )
   })

   it('should be able to delete a question comment', async () => {
      const questionComment = makeQuestionComment()

      await inMemoryQuestionCommentRepository.create(questionComment)


      await sut.execute({
         questionCommentId: questionComment.id.toString(),
         authorId: questionComment.authorId.toString()
      })

      expect(inMemoryQuestionCommentRepository.items).toHaveLength(0)
   })

   it('should not be able to delete another user question comment', async () => {
      const questionComment = makeQuestionComment({
         authorId: new UniqueEntityId('auhtor-1')
      })

      await inMemoryQuestionCommentRepository.create(questionComment)


      expect(() => {
         return sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: 'author-2'
         })
      }).rejects.toBeInstanceOf(Error)
   })
}) 