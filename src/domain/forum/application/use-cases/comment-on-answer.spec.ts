import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { CommentOnAnswerUseCase } from './comment-on-answer';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
   beforeEach(() => {
      inMemoryAnswersAttachmentsRepository =
         new InMemoryAnswerAttachmentsRepository()
      inMemoryAnswerRepository =
         new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
      inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository()
      
      sut = new CommentOnAnswerUseCase(
         inMemoryAnswerRepository,
         inMemoryAnswerCommentRepository,
      )
   })

   it('should be able to comment on answer', async () => {
      const answer = makeAnswer()

      await inMemoryAnswerRepository.create(answer)

      await sut.execute({
         answerId: answer.id.toString(),
         authorId: answer.authorId.toString(),
         content: 'Comentário teste'
      })

      expect(inMemoryAnswerCommentRepository.items[0].content).toEqual('Comentário teste')
   })
})