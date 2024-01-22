import { AnswersRepository } from '../repositories/answer-repository'
import { Question } from "../../enterprise/entities/question"
import { QuestionRepository } from "../repositories/question-repository"
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/erros/errors/not-allowed-error'
import { Either, left, right } from '@/core/either'

interface ChooseQuestionBestAnswerUseCaseRequest {
   answerId: string
   authorId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
   ResourceNotFoundError | NotAllowedError,
   {
      question: Question
   }
>

export class ChooseQuestionBestAnswerUseCase {
   constructor(
      private answersRepository: AnswersRepository,
      private questionRepository: QuestionRepository,
   ) { }
   async execute(
      {
         answerId,
         authorId,
      }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
      const answer = await this.answersRepository.findById(answerId)

      if (!answer) {
         return left(new ResourceNotFoundError())
      }

      const question = await this.questionRepository.findById(
         answer.questionId.toString()
      )

      if (!question) {
         return left(new ResourceNotFoundError())
      }

      if (authorId !== question.authorId.toString()) {
         return left(new NotAllowedError())
      }

      question.bestAnswerId = answer.id

      await this.questionRepository.save(question)

      return right({
         question
      })
   }
}