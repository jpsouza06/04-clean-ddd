import { AnswerAttachment } from "../../enterprise/entities/answer-attachment"

export interface AnswerAttachmentRepository {
   findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
   deleteManyByQuesitonId(answerId: string): Promise<void>
}