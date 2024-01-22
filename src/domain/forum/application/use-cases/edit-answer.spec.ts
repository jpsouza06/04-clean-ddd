import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { EditAnswerUseCase } from './edit-answer';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed-error';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';

let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase
describe('Edit Answer', () => {
   beforeEach(() => {
      inMemoryAnswersAttachmentsRepository =
         new InMemoryAnswerAttachmentsRepository()
      inMemoryAnswersRepository =
         new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)

      sut = new EditAnswerUseCase(
         inMemoryAnswersRepository,
         inMemoryAnswersAttachmentsRepository
      )
   })

   it('should be able to edit a answer', async () => {
      const newAnswer = makeAnswer({
         authorId: new UniqueEntityId('author-1')
      }, new UniqueEntityId('answer-1'))

      await inMemoryAnswersRepository.create(newAnswer)

      inMemoryAnswersAttachmentsRepository.items.push(
         makeAnswerAttachment({
            answerId: newAnswer.id,
            attachmentId: new UniqueEntityId('1')
         }),
         makeAnswerAttachment({
            answerId: newAnswer.id,
            attachmentId: new UniqueEntityId('2')
         })
      )

      await sut.execute({
         answerId: newAnswer.id.toString(),
         authorId: 'author-1',
         content: 'Conteúdo teste',
         attachmentsIds: ['1', '3']
      })

      expect(inMemoryAnswersRepository.items[0]).toMatchObject({
         content: 'Conteúdo teste'
      })
      expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
         expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
         expect.objectContaining({ attachmentId: new UniqueEntityId('3') })
      ])
   })

   it('should not be able to edit a answer from another user', async () => {
      const newAnswer = makeAnswer({
         authorId: new UniqueEntityId('author-1')
      }, new UniqueEntityId('answer-1'))

      await inMemoryAnswersRepository.create(newAnswer)

      const result = await sut.execute({
         answerId: newAnswer.id.toValue(),
         authorId: 'author-2',
         content: 'Conteúdo teste',
         attachmentsIds: []
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(NotAllowedError)
   })
})

