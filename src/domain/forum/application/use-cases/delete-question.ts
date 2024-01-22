import { Either, left, right } from '@/core/either';
import { QuestionRepository } from '../repositories/question-repository';
import { NotAllowedError } from '@/core/erros/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';

interface DeleteQuestionUseCaseRequest {
   authorId: string
   questionId: string
}

type DeleteQuestionUseCaseResponse = Either<
   ResourceNotFoundError | NotAllowedError,
   {}
>

export class DeleteQuestionUseCase {
   constructor(
      private questionRepository: QuestionRepository,
   ) { }
   async execute({
      authorId,
      questionId
   }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
      const question = await this.questionRepository.findById(questionId)

      if (!question) {
         return left(new ResourceNotFoundError())
      }

      if (authorId !== question.authorId.toString()) {
         return left(new NotAllowedError())
      }

      await this.questionRepository.delete(question)

      return right({})
   }
}