import { Answer } from '../../enterprise/entities/answer'
import { Question } from '../../enterprise/entities/question';
import { QuestionRepository } from '../repositories/question-repository';
import { CreateQuestionUseCase } from './create-question';

const fakeQuestionRepository: QuestionRepository = {
   create: async (question: Question) => {
      return;
   }
}

test('create a question', async () => {
   const createQuestion = new CreateQuestionUseCase(fakeQuestionRepository)

   const { question } = await createQuestion.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Nova resposta'
   })


   expect(question.id).toBeTruthy()
})