import { Answer } from "../../enterprise/entities/answer";

export interface AnswersRepository {
   findById(answerId: string): Promise<Answer | null>
   save(question: Answer): Promise<void>
   create(answer: Answer): Promise<void>
   delete(answer: Answer): Promise<void>
}