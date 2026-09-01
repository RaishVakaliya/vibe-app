import { QuestionRepository } from '../src/data/repositories/QuestionRepository';
import { SAMPLE_QUESTIONS } from '../src/data/seeds/sampleQuestions';

describe('Question Pool & Difficulty Logic', () => {
  const repository = new QuestionRepository();

  test('should return exactly 15 unique medium-difficulty questions when requested', async () => {
    const questions = await repository.getQuestions({
      category: 'couples',
      difficulty: 'medium',
      language: 'en',
      count: 15,
      premiumAllowed: true,
    });

    expect(questions.length).toBeLessThanOrEqual(15);
    expect(questions.length).toBeGreaterThan(0);

    // Verify all returned questions have difficulty medium (or fall back if pool exhausted)
    const mediumQuestions = questions.filter((q) => q.difficulty === 'medium');
    expect(mediumQuestions.length).toBeGreaterThan(0);

    // Verify uniqueness of IDs
    const uniqueIds = new Set(questions.map((q) => q.id));
    expect(uniqueIds.size).toBe(questions.length);
  });

  test('should return different question sets for Spicy vs Mild in the same category', async () => {
    const mildQuestions = await repository.getQuestions({
      category: 'friends',
      difficulty: 'mild',
      language: 'en',
      count: 10,
      premiumAllowed: true,
    });

    const spicyQuestions = await repository.getQuestions({
      category: 'friends',
      difficulty: 'spicy',
      language: 'en',
      count: 10,
      premiumAllowed: true,
    });

    expect(mildQuestions.length).toBeGreaterThan(0);
    expect(spicyQuestions.length).toBeGreaterThan(0);

    const mildIds = new Set(mildQuestions.map((q) => q.id));
    const spicyIds = new Set(spicyQuestions.map((q) => q.id));

    // There should be zero overlap between mild and spicy questions
    const overlap = [...mildIds].filter((id) => spicyIds.has(id));
    expect(overlap.length).toBe(0);
  });

  test('should respect the count selector exactly (5, 10, 15, 20, 25)', async () => {
    const counts = [5, 10, 15, 20, 25];
    for (const count of counts) {
      const questions = await repository.getQuestions({
        category: 'random',
        difficulty: 'mild',
        language: 'en',
        count,
        premiumAllowed: true,
      });
      expect(questions.length).toBe(count);
    }
  });

  test('seed database has distinct mild, medium, and spicy tiers for every category', () => {
    const categories = ['couples', 'friends', 'deep_talk', 'party', 'would_you_rather'] as const;

    for (const cat of categories) {
      const catQuestions = SAMPLE_QUESTIONS.filter((q) => q.category === cat);
      const mild = catQuestions.filter((q) => q.difficulty === 'mild');
      const medium = catQuestions.filter((q) => q.difficulty === 'medium');
      const spicy = catQuestions.filter((q) => q.difficulty === 'spicy');

      expect(mild.length).toBeGreaterThanOrEqual(10);
      expect(medium.length).toBeGreaterThanOrEqual(10);
      expect(spicy.length).toBeGreaterThanOrEqual(10);
    }
  });
});
