import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Colors, theme } from '@/constants/Colors';
import {
  tableItems,
  getItemsByCategory,
  getRandomItems,
  TableItem,
} from '@/lib/data';
import { useAppStore } from '@/store/useAppStore';
import { BackButton } from '@/components/BackButton';
import { useTranslation } from '@/lib/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

type GameState = 'ready' | 'playing' | 'finished';

export default function SprintScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [gameState, setGameState] = useState<GameState>('ready');
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentItem, setCurrentItem] = useState<TableItem | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [itemPool, setItemPool] = useState<TableItem[]>([]);

  const addSpeedRecord = useAppStore((s) => s.addSpeedRecord);
  const getBestSpeed = useAppStore((s) => s.getBestSpeed);
  const { t } = useTranslation();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const GAME_DURATION = 60;

  useEffect(() => {
    // Initialize item pool
    const pool = category ? getItemsByCategory(category) : tableItems;
    setItemPool(pool);
  }, [category]);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    startTimeRef.current = Date.now();
    setGameState('playing');
    loadNextQuestion();
  };

  const endGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState('finished');

    // Save record
    addSpeedRecord({
      count: score,
      timeMs: GAME_DURATION * 1000,
      mode: 'sprint',
    });
  };

  const loadNextQuestion = () => {
    const item = itemPool[Math.floor(Math.random() * itemPool.length)];
    setCurrentItem(item);

    // Generate options
    const wrongOptions = getRandomItems(3, undefined)
      .filter((i) => i.number !== item.number)
      .slice(0, 3)
      .map((i) => i.word);

    const allOptions = [item.word, ...wrongOptions].sort(
      () => Math.random() - 0.5
    );
    setOptions(allOptions);
  };

  const handleAnswer = (answer: string) => {
    if (gameState !== 'playing' || !currentItem) return;

    if (answer === currentItem.word) {
      setScore((prev) => prev + 1);
    }
    loadNextQuestion();
  };

  const bestRecord = getBestSpeed('sprint');
  const isNewRecord = gameState === 'finished' && (!bestRecord || score > bestRecord.count);

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
            <Text style={styles.readyEmoji}>🏃</Text>
            <Text style={styles.readyTitle}>{t('sprintTitle')}</Text>
            <Text style={styles.readySubtitle}>
              {t('sprintSubtitle')}
            </Text>

            {bestRecord && (
              <View style={styles.bestRecordBox}>
                <Text style={styles.bestRecordLabel}>{t('yourBest')}</Text>
                <Text style={styles.bestRecordValue}>
                  {bestRecord.count} {t('correct')}
                </Text>
              </View>
            )}

            <Pressable style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>{t('startSprint')}</Text>
            </Pressable>
          </View>
        )}

        {gameState === 'playing' && currentItem && (
          <View style={styles.gameContainer}>
            {/* Timer and score */}
            <View style={styles.gameHeader}>
              <View style={styles.timerBox}>
                <Text style={styles.timerLabel}>{t('time')}</Text>
                <Text
                  style={[
                    styles.timerValue,
                    timeLeft <= 10 && styles.timerValueLow,
                  ]}
                >
                  {timeLeft}s
                </Text>
              </View>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreLabel}>{t('score')}</Text>
                <Text style={styles.scoreValue}>{score}</Text>
              </View>
            </View>

            {/* Question */}
            <View style={styles.questionCard}>
              <Text style={styles.questionNumber}>{currentItem.number}</Text>
            </View>

            {/* Options - large touch targets for speed */}
            <View style={styles.optionsContainer}>
              {options.map((opt, index) => (
                <Pressable
                  key={`${opt}-${index}`}
                  style={styles.speedOption}
                  onPress={() => handleAnswer(opt)}
                >
                  <Text style={styles.speedOptionText}>{opt}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {gameState === 'finished' && (
          <View style={styles.finishedContainer}>
            <Text style={styles.finishedEmoji}>
              {isNewRecord ? '🏆' : score >= 30 ? '🔥' : score >= 20 ? '👏' : '💪'}
            </Text>
            <Text style={styles.finishedTitle}>
              {isNewRecord ? t('newRecord') : t('timesUp')}
            </Text>
            <Text style={styles.finishedScore}>{score} {t('correct')}</Text>

            {isNewRecord && (
              <Text style={styles.newRecordText}>
                {t('beatPreviousBest')} {bestRecord?.count || 0}!
              </Text>
            )}

            <View style={styles.finishedActions}>
              <Pressable style={styles.playAgainButton} onPress={startGame}>
                <Text style={styles.playAgainButtonText}>{t('playAgain')}</Text>
              </Pressable>
            </View>
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
    marginBottom: theme.spacing.xl,
  },
  bestRecordBox: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentLime,
  },
  bestRecordLabel: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textMuted,
  },
  bestRecordValue: {
    fontSize: theme.fontSizes['2xl'],
    fontWeight: '700',
    color: Colors.accentLime,
  },
  startButton: {
    backgroundColor: Colors.accentCyan,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.xl,
  },
  startButtonText: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  gameContainer: {
    flex: 1,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  timerBox: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    minWidth: 100,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: theme.fontSizes.xs,
    color: Colors.textMuted,
  },
  timerValue: {
    fontSize: theme.fontSizes['3xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  timerValueLow: {
    color: Colors.error,
  },
  scoreBox: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    minWidth: 100,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: theme.fontSizes.xs,
    color: Colors.textMuted,
  },
  scoreValue: {
    fontSize: theme.fontSizes['3xl'],
    fontWeight: '700',
    color: Colors.accentLime,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  questionCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing.xxl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  questionNumber: {
    fontSize: 96,
    fontWeight: '700',
    color: Colors.accentCyan,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  optionsContainer: {
    gap: theme.spacing.sm,
  },
  speedOption: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.1s ease',
      },
    }),
  },
  speedOptionText: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
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
    color: Colors.accentCyan,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  newRecordText: {
    fontSize: theme.fontSizes.base,
    color: Colors.accentLime,
    marginBottom: theme.spacing.xl,
  },
  finishedActions: {
    marginTop: theme.spacing.lg,
  },
  playAgainButton: {
    backgroundColor: Colors.accentCyan,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.lg,
  },
  playAgainButtonText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: Colors.textInverse,
  },
});
