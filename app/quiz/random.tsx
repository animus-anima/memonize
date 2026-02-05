import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, theme } from '@/constants/Colors';
import { tableItems, getRandomItems, TableItem } from '@/lib/data';
import { useAppStore } from '@/store/useAppStore';
import { BackButton } from '@/components/BackButton';
import { QuizCard } from '@/components/QuizCard';
import { useTranslation } from '@/lib/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

type QuizMode = 'number-to-word' | 'word-to-number' | 'emoji-to-both';

export default function RandomQuizScreen() {
  const [mode, setMode] = useState<QuizMode>('number-to-word');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizItems, setQuizItems] = useState<TableItem[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const updateStreak = useAppStore((s) => s.updateStreak);
  const addQuizResult = useAppStore((s) => s.addQuizResult);
  const currentStreak = useAppStore((s) => s.currentStreak);
  const { t } = useTranslation();

  const QUIZ_LENGTH = 20;

  useEffect(() => {
    startNewQuiz();
  }, []);

  const startNewQuiz = () => {
    setQuizItems(getRandomItems(QUIZ_LENGTH));
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setIsComplete(false);
  };

  const handleAnswer = (correct: boolean) => {
    updateStreak(correct);
    const newScore = {
      correct: score.correct + (correct ? 1 : 0),
      total: score.total + 1,
    };
    setScore(newScore);

    if (currentIndex < quizItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
      addQuizResult({
        phase: 'interleaving',
        categoryId: null,
        totalQuestions: newScore.total,
        correctAnswers: newScore.correct,
        timeSpentMs: 0, // Could track time if needed
      });
    }
  };

  const currentItem = quizItems[currentIndex];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Language Switcher - Top Right */}
      <View style={styles.langSwitcher}>
        <LanguageSwitcher />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.title}>{t('randomQuizTitle')}</Text>
          <Text style={styles.subtitle}>
            {t('mixedItems')}
          </Text>
        </View>

        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          <Pressable
            style={[
              styles.modeButton,
              mode === 'number-to-word' && styles.modeButtonActive,
            ]}
            onPress={() => setMode('number-to-word')}
          >
            <Text style={styles.modeButtonText}>{t('numberToWord')}</Text>
          </Pressable>
          <Pressable
            style={[
              styles.modeButton,
              mode === 'word-to-number' && styles.modeButtonActive,
            ]}
            onPress={() => setMode('word-to-number')}
          >
            <Text style={styles.modeButtonText}>{t('wordToNumber')}</Text>
          </Pressable>
        </View>

        {/* Progress and streak */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>{t('progress')}</Text>
            <Text style={styles.statValue}>
              {currentIndex + 1}/{quizItems.length}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>{t('score')}</Text>
            <Text style={[styles.statValue, styles.statValueGreen]}>
              {score.correct}/{score.total}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>{t('streak')}</Text>
            <Text
              style={[
                styles.statValue,
                currentStreak > 0 && styles.statValueCyan,
              ]}
            >
              🔥 {currentStreak}
            </Text>
          </View>
        </View>

        {/* Quiz content */}
        {!isComplete && currentItem ? (
          <QuizCard
            item={currentItem}
            mode={mode}
            allItems={tableItems}
            onAnswer={handleAnswer}
          />
        ) : isComplete ? (
          <View style={styles.completeContainer}>
            <Text style={styles.completeEmoji}>
              {score.correct / score.total >= 0.8 ? '🎉' : score.correct / score.total >= 0.5 ? '👍' : '💪'}
            </Text>
            <Text style={styles.completeTitle}>{t('quizComplete')}</Text>
            <Text style={styles.completeScore}>
              {score.correct}/{score.total} {t('correct')} (
              {Math.round((score.correct / score.total) * 100)}%)
            </Text>

            <View style={styles.completeActions}>
              <Pressable
                style={styles.restartButton}
                onPress={startNewQuiz}
              >
                <Text style={styles.restartButtonText}>{t('tryAgain')}</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{t('loading')}</Text>
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
  modeToggle: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  modeButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: Colors.bgSurface,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: Colors.accentCyan,
  },
  modeButtonText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.fontSizes.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  statValueGreen: {
    color: Colors.accentLime,
  },
  statValueCyan: {
    color: Colors.accentCyan,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fontSizes.lg,
    color: Colors.textSecondary,
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
  completeActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
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
