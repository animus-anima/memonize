import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, theme, CategoryColors } from '@/constants/Colors';
import {
  categories,
  getItemsByCategory,
  getRandomItems,
  TableItem,
  getCategoryById,
} from '@/lib/data';
import { useAppStore } from '@/store/useAppStore';
import { BackButton } from '@/components/BackButton';
import { useTranslation } from '@/lib/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface Question {
  items: TableItem[];
  oddItem: TableItem;
  categoryName: string;
}

export default function OddOneOutScreen() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [questionCount, setQuestionCount] = useState(0);

  const updateStreak = useAppStore((s) => s.updateStreak);
  const currentStreak = useAppStore((s) => s.currentStreak);
  const { t } = useTranslation();

  const QUIZ_LENGTH = 10;

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    // Pick a random category
    const mainCategory = categories[Math.floor(Math.random() * categories.length)];
    const mainItems = getItemsByCategory(mainCategory.id);

    // Pick 3 items from main category
    const shuffledMain = [...mainItems].sort(() => Math.random() - 0.5);
    const selectedMain = shuffledMain.slice(0, 3);

    // Pick different category for odd one
    let oddCategory;
    do {
      oddCategory = categories[Math.floor(Math.random() * categories.length)];
    } while (oddCategory.id === mainCategory.id);

    const oddItems = getItemsByCategory(oddCategory.id);
    const oddItem = oddItems[Math.floor(Math.random() * oddItems.length)];

    // Combine and shuffle
    const allItems = [...selectedMain, oddItem].sort(() => Math.random() - 0.5);

    setQuestion({
      items: allItems,
      oddItem,
      categoryName: mainCategory.name,
    });
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleSelect = (itemNumber: number) => {
    if (showResult || !question) return;

    setSelectedAnswer(itemNumber);
    setShowResult(true);

    const isCorrect = itemNumber === question.oddItem.number;
    updateStreak(isCorrect);

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    setQuestionCount((prev) => prev + 1);
  };

  const handleNext = () => {
    if (questionCount >= QUIZ_LENGTH) {
      // Reset for new round
      setScore({ correct: 0, total: 0 });
      setQuestionCount(0);
    }
    generateQuestion();
  };

  if (!question) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </SafeAreaView>
    );
  }

  const isComplete = questionCount >= QUIZ_LENGTH && showResult;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Language Switcher - Top Right */}
      <View style={styles.langSwitcher}>
        <LanguageSwitcher />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.title}>{t('oddOneOutTitle')}</Text>
          <Text style={styles.subtitle}>
            {t('findOddOne')}
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            {Math.min(questionCount + 1, QUIZ_LENGTH)}/{QUIZ_LENGTH}
          </Text>
          <Text style={styles.scoreText}>
            {t('score')}: {score.correct}/{score.total}
          </Text>
          <Text style={styles.streakText}>🔥 {currentStreak}</Text>
        </View>

        {!isComplete ? (
          <>
            {/* Question */}
            <View style={styles.questionBox}>
              <Text style={styles.questionText}>
                {t('whichNotIn')}{' '}
                <Text style={styles.categoryHighlight}>
                  {t(question.categoryName.toLowerCase() as any)}
                </Text>
                ?
              </Text>
            </View>

            {/* Options */}
            <View style={styles.optionsGrid}>
              {question.items.map((item) => {
                const isSelected = selectedAnswer === item.number;
                const isOdd = item.number === question.oddItem.number;
                const showCorrect = showResult && isOdd;
                const showWrong = showResult && isSelected && !isOdd;

                const itemCategory = getCategoryById(item.categoryId);
                const itemColor = CategoryColors[item.categoryId];

                return (
                  <Pressable
                    key={item.number}
                    style={[
                      styles.option,
                      isSelected && !showResult && styles.optionSelected,
                      showCorrect && styles.optionCorrect,
                      showWrong && styles.optionWrong,
                    ]}
                    onPress={() => handleSelect(item.number)}
                    disabled={showResult}
                  >
                    <Text style={styles.optionEmoji}>{item.emoji}</Text>
                    <Text style={styles.optionWord}>{item.word}</Text>
                    <Text style={styles.optionNumber}>{item.number}</Text>

                    {showResult && (
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: `${itemColor}30` },
                        ]}
                      >
                        <Text style={[styles.categoryBadgeText, { color: itemColor }]}>
                          {itemCategory ? t(itemCategory.id as any) : ''}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Next button */}
            {showResult && (
              <Pressable style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {questionCount >= QUIZ_LENGTH ? t('newRound') : t('next')}
                </Text>
              </Pressable>
            )}
          </>
        ) : (
          <View style={styles.completeContainer}>
            <Text style={styles.completeEmoji}>🔍</Text>
            <Text style={styles.completeTitle}>{t('roundComplete')}</Text>
            <Text style={styles.completeScore}>
              {score.correct}/{score.total} {t('correct')}
            </Text>
            <Pressable style={styles.restartButton} onPress={handleNext}>
              <Text style={styles.restartButtonText}>{t('playAgain')}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  langSwitcher: {
    position: 'absolute',
    top: 50,
    right: theme.spacing.lg,
    zIndex: 100,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSizes['3xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSizes.base,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: theme.fontSizes.lg,
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  progressText: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textMuted,
  },
  scoreText: {
    fontSize: theme.fontSizes.sm,
    color: Colors.accentLime,
    fontWeight: '600',
  },
  streakText: {
    fontSize: theme.fontSizes.sm,
    color: Colors.accentCyan,
  },
  questionBox: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  questionText: {
    fontSize: theme.fontSizes.lg,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 28,
  },
  categoryHighlight: {
    color: Colors.accentCyan,
    fontWeight: '600',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  option: {
    width: '47%',
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
  },
  optionSelected: {
    borderColor: Colors.accentCyan,
    backgroundColor: Colors.bgElevated,
  },
  optionCorrect: {
    borderColor: Colors.success,
    backgroundColor: `${Colors.success}15`,
  },
  optionWrong: {
    borderColor: Colors.error,
    backgroundColor: `${Colors.error}15`,
  },
  optionEmoji: {
    fontSize: 40,
    marginBottom: theme.spacing.sm,
  },
  optionWord: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  optionNumber: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textMuted,
  },
  categoryBadge: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  categoryBadgeText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: Colors.accentCyan,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeEmoji: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  completeTitle: {
    fontSize: theme.fontSizes['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  completeScore: {
    fontSize: theme.fontSizes.lg,
    color: Colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  restartButton: {
    backgroundColor: Colors.accentCyan,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
  },
  restartButtonText: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: Colors.textInverse,
  },
});
