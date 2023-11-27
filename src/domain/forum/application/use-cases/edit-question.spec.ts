import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { EditQuestionUseCase } from './edit-question';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase
describe('Edit Question', () => {
   beforeEach(() => {
      inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
      sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
   })

   it('should be able to edit a question', async () => {
      const newQuestion = makeQuestion({
         authorId: new UniqueEntityId('author-1')
      }, new UniqueEntityId('question-1'))

      await inMemoryQuestionsRepository.create(newQuestion)

      await sut.execute({
         questionId: newQuestion.id.toString(),
         authorId: 'author-1',
         title: 'Titulo teste',
         content: 'Conteúdo teste'
      })

      expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
         title: 'Titulo teste',
         content: 'Conteúdo teste'
      })
   })

   it('should not be able to edit a question from another user', async () => {
      const newQuestion = makeQuestion({
         authorId: new UniqueEntityId('author-1')
      }, new UniqueEntityId('question-1'))

      await inMemoryQuestionsRepository.create(newQuestion)

      expect(() => {
         return sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-2',
            title: 'Titulo teste',
            content: 'Conteúdo teste'
         })
      }).rejects.toBeInstanceOf(Error)
   })
})
