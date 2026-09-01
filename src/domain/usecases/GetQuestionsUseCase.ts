import type { Question } from '../entities/Question';
import type { IQuestionRepository, GetQuestionsParams } from '../repositories/IQuestionRepository';
import { shuffleArray } from '@core/utils/shuffleUtils';

export class GetQuestionsUseCase {
  constructor(private readonly questionRepository: IQuestionRepository) {}

  async execute(params: GetQuestionsParams): Promise<Question[]> {
    const questions = await this.questionRepository.getQuestions(params);
    return shuffleArray(questions).slice(0, params.count);
  }
}
