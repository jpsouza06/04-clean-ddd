import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { EditQuestionUseCase } from './edit-question';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/erros/errors/not-allowed-error';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachemnt-repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase
describe('Edit Question', () => {
   beforeEach(() => {
      inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
      inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository)

      sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentRepository)
   })

   it('should be able to edit a question', async () => {
      const newQuestion = makeQuestion({
         authorId: new UniqueEntityId('author-1')
      }, new UniqueEntityId('question-1'))

      await inMemoryQuestionsRepository.create(newQuestion)

      inMemoryQuestionAttachmentRepository.items.push(
         makeQuestionAttachment({
            questionId: newQuestion.id,
            attachmentId: new UniqueEntityId('1')
         }),
         makeQuestionAttachment({
            questionId: newQuestion.id,
            attachmentId: new UniqueEntityId('2')
         })
      )

      await sut.execute({
         questionId: newQuestion.id.toString(),
         authorId: 'author-1',
         title: 'Titulo teste',
         content: 'Conteúdo teste',
         attachmentsIds: ['1', '3'],
      })

      expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
         title: 'Titulo teste',
         content: 'Conteúdo teste'
      })
      expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
      expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
         expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
         expect.objectContaining({ attachmentId: new UniqueEntityId('3') })
      ])
   })

   it('should not be able to edit a question from another user', async () => {
      const newQuestion = makeQuestion({
         authorId: new UniqueEntityId('author-1')
      }, new UniqueEntityId('question-1'))

      await inMemoryQuestionsRepository.create(newQuestion)

      const result = await sut.execute({
         questionId: newQuestion.id.toValue(),
         authorId: 'author-2',
         title: 'Titulo teste',
         content: 'Conteúdo teste',
         attachmentsIds: [],
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(NotAllowedError)
   })
})

