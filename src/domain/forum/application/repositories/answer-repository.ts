import { PaginationParams } from "@/core/repositories/paginations-params";
import { Answer } from "../../enterprise/entities/answer";

export interface AnswersRepository {
   findById(answerId: string): Promise<Answer | null>
   findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]>
   save(question: Answer): Promise<void>
   create(answer: Answer): Promise<void>
   delete(answer: Answer): Promise<void>
}