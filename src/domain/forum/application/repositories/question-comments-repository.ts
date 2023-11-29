import { QuestionComment } from "../../enterprise/entities/question-comment";
import { PaginationParams } from "@/core/repositories/paginations-params";

export interface QuestionCommentRepository {
   findById(id: string): Promise<QuestionComment | null>
   findManyByQuestionId(
      questionId: string,
      params: PaginationParams
   ): Promise<QuestionComment[]>
   create(questionComment: QuestionComment): Promise<void>
   delete(questionComment: QuestionComment): Promise<void>
}