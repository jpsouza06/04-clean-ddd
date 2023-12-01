import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from '../repositories/answer-repository'
import { Either, right } from "@/core/either"

interface AnswerQuestionUseCaseRequest {
   instrucionId: string
   questionId: string
   content: string
}

type AnswerQuestionUseCaseResponse = Either<
   null,
   {
      answer: Answer
   }
>

export class AnswerQuestionUseCase {
   constructor(
      private answersRepository: AnswersRepository,
   ) { }
   async execute(
      {
         instrucionId,
         questionId,
         content
      }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
      const answer = Answer.create({
         content,
         authorId: new UniqueEntityId(instrucionId),
         questionId: new UniqueEntityId(questionId),
      })

      await this.answersRepository.create(answer)

      return right({
         answer
      })
   }
}