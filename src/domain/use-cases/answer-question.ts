import { Answer } from "../entities/answer"
import { AnswersRepository } from '../repositories/answer-repository'

interface AnswerQuestionUseCaseRequest {
   instrucionId: string
   questionId: string
   content: string
}

export class AnswerQuestionUseCase {
   constructor(
      private answersRepository: AnswersRepository,
   ) {}
   async execute({instrucionId, questionId, content}: AnswerQuestionUseCaseRequest) {
      const answer = new Answer({
         content,
         authorId: instrucionId,
         questionId  
      })

      await this.answersRepository.create(answer)

      return answer
   }
}