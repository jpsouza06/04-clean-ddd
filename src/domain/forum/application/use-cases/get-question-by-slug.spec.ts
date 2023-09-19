import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { Question } from '../../enterprise/entities/question';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { GetQuestionBySlugUseCase } from './get-questions-by-slug';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase
describe('Get Question By Slug', () => {
   beforeEach(() => {
      inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
      sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
   })

   test('should be able to get a question by slug', async () => {
      const newQuestion = Question.create({
         title: 'Example quesiton',
         slug: Slug.create('example-question'),
         authorId: new UniqueEntityId(),
         content: 'Example content'
      })

      await inMemoryQuestionsRepository.create(newQuestion)

      const { question } = await sut.execute({
         slug: 'example-question'
      })

      expect(question.id).toBeTruthy()
      expect(question.title).toEqual(newQuestion.title)
   })
})

