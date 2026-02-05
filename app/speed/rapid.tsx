import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Colors, theme } from '@/constants/Colors';
import {
  tableItems,
  getItemsByCategory,
  TableItem,
} from '@/lib/data';
import { useAppStore } from '@/store/useAppStore';
import { BackButton } from '@/components/BackButton';
import { useTranslation } from '@/lib/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

type GameState = 'ready' | 'playing' | 'finished';

export default function RapidFireScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [gameState, setGameState] = useState<GameState>('ready');
  const [currentItem, setCurrentItem] = useState<TableItem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [itemPool, setItemPool] = useState<TableItem[]>([]);
  const [itemIndex, setItemIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const addSpeedRecord = useAppStore((s) => s.addSpeedRecord);
  const getBestSpeed = useAppStore((s) => s.getBestSpeed);
  const { t } = useTranslation();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  const ITEM_DURATION = 2000; // 2 seconds per item
  const TOTAL_ITEMS = 20;

  useEffect(() => {
    const pool = category ? getItemsByCategory(category) : tableItems;
    setItemPool([...pool].sort(() => Math.random() - 0.5));
  }, [category]);

  useEffect(() => {
    if (gameState === 'playing' && itemIndex < TOTAL_ITEMS) {
      setCurrentItem(itemPool[itemIndex % itemPool.length]);
      setUserAnswer(null);
      setShowAnswer(false);

      // Animate progress bar
      progressAnim.setValue(1);
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: ITEM_DURATION,
        useNativeDriver: false,
      }).start();

      // Auto-advance timer
      timerRef.current = setTimeout(() => {
        handleTimeout();
      }, ITEM_DURATION);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameState, itemIndex]);

  const startGame = () => {
    setScore({ correct: 0, total: 0 });
    setItemIndex(0);
    setItemPool([...itemPool].sort(() => Math.random() - 0.5));
    setGameState('playing');
  };

  const handleTimeout = () => {
    // No answer given - mark as wrong
    setShowAnswer(true);
    setScore((prev) => ({ ...prev, total: prev.total + 1 }));

    setTimeout(() => {
      if (itemIndex + 1 >= TOTAL_ITEMS) {
        endGame();
      } else {
        setItemIndex((prev) => prev + 1);
      }
    }, 500);
  };

  const handleAnswer = (isKnown: boolean) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setUserAnswer(isKnown ? 'known' : 'skip');
    setShowAnswer(true);

    // In rapid fire, we trust the user's self-assessment
    setScore((prev) => ({
      correct: prev.correct + (isKnown ? 1 : 0),
      total: prev.total + 1,
    }));

    setTimeout(() => {
      if (itemIndex + 1 >= TOTAL_ITEMS) {
        endGame();
      } else {
        setItemIndex((prev) => prev + 1);
      }
    }, 500);
  };

  const endGame = () => {
    setGameState('finished');
    addSpeedRecord({
      count: score.correct + (userAnswer === 'known' ? 1 : 0),
      timeMs: TOTAL_ITEMS * ITEM_DURATION,
      mode: 'rapid-fire',
    });
  };

  const bestRecord = getBestSpeed('rapid-fire');
  const finalScore = score.correct;
  const isNewRecord = gameState === 'finished' && (!bestRecord || finalScore > bestRecord.count);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Language Switcher - Top Right */}
      {gameState !== 'playing' && (
        <View style={styles.langSwitcher}>
          <LanguageSwitcher />
        </View>
      )}

      <View style={styles.content}>
        {gameState !== 'playing' && (
          <View style={styles.header}>
            <BackButton />
          </View>
        )}

        {gameState === 'ready' && (
          <View style={styles.readyContainer}>
            <Text style={styles.readyEmoji}>⚡</Text>
            <Text style={styles.readyTitle}>{t('rapidFireTitle')}</Text>
            <Text style={styles.readySubtitle}>
              {t('rapidFireSubtitle')}
            </Text>

            {bestRecord && (
              <View style={styles.bestRecordBox}>
                <Text style={styles.bestRecordLabel}>{t('yourBest')}</Text>
                <Text style={styles.bestRecordValue}>
                  {bestRecord.count}/{TOTAL_ITEMS}
                </Text>
              </View>
            )}

            <Pressable style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>{t('start')}</Text>
            </Pressable>
          </View>
        )}

        {gameState === 'playing' && currentItem && (
          <View style={styles.gameContainer}>
            {/* Progress bar */}
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>

            {/* Item counter */}
            <View style={styles.counterRow}>
              <Text style={styles.counterText}>
                {itemIndex + 1}/{TOTAL_ITEMS}
              </Text>
              <Text style={styles.scoreText}>
                {score.correct} {t('correct')}
              </Text>
            </View>

            {/* Question card */}
            <View style={styles.questionCard}>
              <Text style={styles.questionNumber}>{currentItem.number}</Text>
              {showAnswer && (
                <View style={styles.answerReveal}>
                  <Text style={styles.answerEmoji}>{currentItem.emoji}</Text>
                  <Text style={styles.answerWord}>{currentItem.word}</Text>
                </View>
              )}
            </View>

            {/* Action buttons */}
            {!showAnswer && (
              <View style={styles.actionButtons}>
                <Pressable
                  style={[styles.actionButton, styles.skipButton]}
                  onPress={() => handleAnswer(false)}
                >
                  <Text style={styles.skipButtonText}>{t('skip')}</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.knowButton]}
                  onPress={() => handleAnswer(true)}
                >
                  <Text style={styles.knowButtonText}>{t('iKnowIt')}</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {gameState === 'finished' && (
          <View style={styles.finishedContainer}>
            <Text style={styles.finishedEmoji}>
              {isNewRecord ? '🏆' : finalScore >= TOTAL_ITEMS * 0.8 ? '🔥' : finalScore >= TOTAL_ITEMS * 0.5 ? '👏' : '💪'}
            </Text>
            <Text style={styles.finishedTitle}>
              {isNewRecord ? t('newRecord') : t('complete')}
            </Text>
            <Text style={styles.finishedScore}>
              {finalScore}/{TOTAL_ITEMS} {t('known')}
            </Text>

            {isNewRecord && bestRecord && (
              <Text style={styles.newRecordText}>
                {t('previousBest')}: {bestRecord.count}
              </Text>
            )}

            <Pressable style={styles.playAgainButton} onPress={startGame}>
              <Text style={styles.playAgainButtonText}>{t('playAgain')}</Text>
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
    marginBottom: theme.spacing.lg,
  },
  readyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readyEmoji: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  readyTitle: {
    fontSize: theme.fontSizes['3xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  readySubtitle: {
    fontSize: theme.fontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  bestRecordBox: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentViolet,
  },
  bestRecordLabel: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textMuted,
  },
  bestRecordValue: {
    fontSize: theme.fontSizes['2xl'],
    fontWeight: '700',
    color: Colors.accentViolet,
  },
  startButton: {
    backgroundColor: Colors.accentViolet,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.xl,
  },
  startButtonText: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  gameContainer: {
    flex: 1,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.bgSurface,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.accentViolet,
    borderRadius: 3,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  counterText: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textMuted,
  },
  scoreText: {
    fontSize: theme.fontSizes.sm,
    color: Colors.accentLime,
    fontWeight: '600',
  },
  questionCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing.xxl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    minHeight: 200,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  questionNumber: {
    fontSize: 96,
    fontWeight: '700',
    color: Colors.accentViolet,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  answerReveal: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  answerEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  answerWord: {
    fontSize: theme.fontSizes['2xl'],
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: Colors.bgSurface,
    borderWidth: 2,
    borderColor: Colors.borderVisible,
  },
  skipButtonText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  knowButton: {
    backgroundColor: Colors.accentLime,
  },
  knowButtonText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishedEmoji: {
    fontSize: 100,
    marginBottom: theme.spacing.lg,
  },
  finishedTitle: {
    fontSize: theme.fontSizes['3xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  finishedScore: {
    fontSize: theme.fontSizes['2xl'],
    color: Colors.accentViolet,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  newRecordText: {
    fontSize: theme.fontSizes.base,
    color: Colors.textMuted,
    marginBottom: theme.spacing.xl,
  },
  playAgainButton: {
    backgroundColor: Colors.accentViolet,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.lg,
  },
  playAgainButtonText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
