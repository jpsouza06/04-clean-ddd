import { Either, left, right } from '@/core/either';
import { AnswersRepository } from '../repositories/answer-repository';
import { NotAllowedError } from '@/core/erros/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';

interface DeleteAnswerUseCaseRequest {
   authorId: string
   answerId: string
}

type DeleteAnswerUseCaseResponse = Either<
   ResourceNotFoundError | NotAllowedError,
   {}
>

export class DeleteAnswerUseCase {
   constructor(
      private answerRepository: AnswersRepository,
   ) { }
   async execute({
      authorId,
      answerId
   }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
      const answer = await this.answerRepository.findById(answerId)

      if (!answer) {
         return left(new ResourceNotFoundError())
      }

      if (authorId !== answer.authorId.toString()) {
         return left(new NotAllowedError())
      }

      await this.answerRepository.delete(answer)

      return right({})
   }
}