import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { makeQuestion } from 'test/factories/make-question';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
   beforeEach(() => {
      inMemoryQuestionRepository = new InMemoryQuestionsRepository()
      inMemoryAnswersRepository = new InMemoryAnswersRepository()
      sut = new ChooseQuestionBestAnswerUseCase(
         inMemoryAnswersRepository,
         inMemoryQuestionRepository
      )
   })

   it('should be able to choose the question best answer', async () => {
      const question = makeQuestion()
      const answer = makeAnswer({
         questionId: question.id
      })

      await inMemoryQuestionRepository.create(question)
      await inMemoryAnswersRepository.create(answer)

      await sut.execute({
         answerId: answer.id.toString(),
         authorId: question.authorId.toString()
      })

      expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(answer.id)
   })

   it('should not be able to choose another user question best answer', async () => {
      const question = makeQuestion({
         authorId: new UniqueEntityId('author-1')
      })

      const answer = makeAnswer({
         questionId: question.id
      })

      await inMemoryQuestionRepository.create(question)
      await inMemoryAnswersRepository.create(answer)

      await sut.execute({
         answerId: answer.id.toString(),
         authorId: question.authorId.toString()
      })

      expect(() => {
         return sut.execute({
            answerId: answer.id.toString(),
            authorId: 'author-2'
         })
      }).rejects.toBeInstanceOf(Error)
   })
})