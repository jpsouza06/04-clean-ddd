import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { AnswerQuestionUseCase } from './answer-question';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
   beforeEach(() => {
      inMemoryAnswersAttachmentsRepository =
         new InMemoryAnswerAttachmentsRepository()
      inMemoryAnswersRepository =
         new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)

      sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
   })

   test('should be able to create a answer', async () => {
      const result = await sut.execute({
         instrucionId: '1',
         questionId: '1',
         content: 'Nova reposta',
         attachmentsIds: ['1', '2'],
      })

      expect(result.isRight()).toBe(true)
      expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
      expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2)
      expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
         expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
         expect.objectContaining({ attachmentId: new UniqueEntityId('2') })
      ])
   })
})

