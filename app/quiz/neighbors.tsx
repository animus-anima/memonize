import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, theme } from '@/constants/Colors';
import { getRandomItems, getNeighbors, getItemByNumber, TableItem } from '@/lib/data';
import { useAppStore } from '@/store/useAppStore';
import { BackButton } from '@/components/BackButton';
import { useTranslation } from '@/lib/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function NeighborsQuizScreen() {
  const [currentItem, setCurrentItem] = useState<TableItem | null>(null);
  const [prevAnswer, setPrevAnswer] = useState('');
  const [nextAnswer, setNextAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [questionCount, setQuestionCount] = useState(0);

  const updateStreak = useAppStore((s) => s.updateStreak);
  const currentStreak = useAppStore((s) => s.currentStreak);
  const { t } = useTranslation();

  const QUIZ_LENGTH = 10;

  useEffect(() => {
    loadNextQuestion();
  }, []);

  const loadNextQuestion = () => {
    // Get random item that has both neighbors (not 1 or 100)
    let item: TableItem;
    do {
      [item] = getRandomItems(1);
    } while (item.number === 1 || item.number === 100);

    setCurrentItem(item);
    setPrevAnswer('');
    setNextAnswer('');
    setShowResult(false);
  };

  const handleSubmit = () => {
    if (!currentItem) return;

    const neighbors = getNeighbors(currentItem.number);
    const prevCorrect =
      prevAnswer.toLowerCase().trim() ===
      neighbors.prev?.word.toLowerCase();
    const nextCorrect =
      nextAnswer.toLowerCase().trim() ===
      neighbors.next?.word.toLowerCase();

    const bothCorrect = prevCorrect && nextCorrect;
    updateStreak(bothCorrect);

    setScore((prev) => ({
      correct: prev.correct + (bothCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    setShowResult(true);
    setQuestionCount((prev) => prev + 1);
  };

  const handleNext = () => {
    if (questionCount >= QUIZ_LENGTH) {
      // Quiz complete - could navigate to results
      loadNextQuestion();
      setScore({ correct: 0, total: 0 });
      setQuestionCount(0);
    } else {
      loadNextQuestion();
    }
  };

  if (!currentItem) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </SafeAreaView>
    );
  }

  const neighbors = getNeighbors(currentItem.number);
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
          <Text style={styles.title}>{t('neighborsTitle')}</Text>
          <Text style={styles.subtitle}>
            {t('neighborsDesc')}
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
            {/* Question card */}
            <View style={styles.questionCard}>
              <Text style={styles.questionLabel}>{t('whatSurrounds')}</Text>
              <View style={styles.currentItemDisplay}>
                <Text style={styles.currentNumber}>{currentItem.number}</Text>
                <Text style={styles.currentEmoji}>{currentItem.emoji}</Text>
                <Text style={styles.currentWord}>{currentItem.word}</Text>
              </View>
            </View>

            {/* Answer inputs */}
            <View style={styles.answersContainer}>
              {/* Previous */}
              <View style={styles.answerBox}>
                <Text style={styles.answerLabel}>
                  ← {t('before')} ({currentItem.number - 1})
                </Text>
                <TextInput
                  style={[
                    styles.answerInput,
                    showResult &&
                      (prevAnswer.toLowerCase().trim() ===
                      neighbors.prev?.word.toLowerCase()
                        ? styles.inputCorrect
                        : styles.inputWrong),
                  ]}
                  value={prevAnswer}
                  onChangeText={setPrevAnswer}
                  placeholder={t('typeTheWord')}
                  placeholderTextColor={Colors.textMuted}
                  editable={!showResult}
                  autoCapitalize="none"
                />
                {showResult && (
                  <Text style={styles.correctAnswer}>
                    {neighbors.prev?.emoji} {neighbors.prev?.word}
                  </Text>
                )}
              </View>

              {/* Next */}
              <View style={styles.answerBox}>
                <Text style={styles.answerLabel}>
                  {t('after')} ({currentItem.number + 1}) →
                </Text>
                <TextInput
                  style={[
                    styles.answerInput,
                    showResult &&
                      (nextAnswer.toLowerCase().trim() ===
                      neighbors.next?.word.toLowerCase()
                        ? styles.inputCorrect
                        : styles.inputWrong),
                  ]}
                  value={nextAnswer}
                  onChangeText={setNextAnswer}
                  placeholder={t('typeTheWord')}
                  placeholderTextColor={Colors.textMuted}
                  editable={!showResult}
                  autoCapitalize="none"
                />
                {showResult && (
                  <Text style={styles.correctAnswer}>
                    {neighbors.next?.emoji} {neighbors.next?.word}
                  </Text>
                )}
              </View>
            </View>

            {/* Submit/Next button */}
            <Pressable
              style={styles.submitButton}
              onPress={showResult ? handleNext : handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {showResult ? t('next') : t('check')}
              </Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.completeContainer}>
            <Text style={styles.completeEmoji}>🎯</Text>
            <Text style={styles.completeTitle}>{t('roundComplete')}</Text>
            <Text style={styles.completeScore}>
              {score.correct}/{score.total} {t('perfectPairs')}
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
    marginBottom: theme.spacing.xl,
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
  questionCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  questionLabel: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  currentItemDisplay: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  currentNumber: {
    fontSize: 56,
    fontWeight: '700',
    color: Colors.accentCyan,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  currentEmoji: {
    fontSize: 48,
  },
  currentWord: {
    fontSize: theme.fontSizes['2xl'],
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  answersContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  answerBox: {
    flex: 1,
  },
  answerLabel: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  answerInput: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.base,
    color: Colors.textPrimary,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
  },
  inputCorrect: {
    borderColor: Colors.success,
    backgroundColor: `${Colors.success}15`,
  },
  inputWrong: {
    borderColor: Colors.error,
    backgroundColor: `${Colors.error}15`,
  },
  correctAnswer: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  submitButton: {
    backgroundColor: Colors.accentCyan,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  submitButtonText: {
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
