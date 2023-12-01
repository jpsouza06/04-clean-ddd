import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { AnswerQuestionUseCase } from './answer-question';

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
   beforeEach(() => {
      inMemoryAnswersRepository = new InMemoryAnswersRepository()
      sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
   })

   test('should be able to create a answer', async () => {
      const result = await sut.execute({
         instrucionId: '1',
         questionId: '1',
         content: 'Nova reposta'
      })

      expect(result.isRight()).toBe(true)
      expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
   })
})

