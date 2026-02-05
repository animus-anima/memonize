import { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, Platform } from 'react-native';
import { Colors, theme } from '@/constants/Colors';
import { TableItem, getRandomItems } from '@/lib/data';
import { useAppStore } from '@/store/useAppStore';

interface QuizCardProps {
  item: TableItem;
  mode: 'number-to-word' | 'word-to-number' | 'emoji-to-both';
  allItems: TableItem[];
  onAnswer: (correct: boolean) => void;
  optionCount?: number;
}

export function QuizCard({
  item,
  mode,
  allItems,
  onAnswer,
  optionCount = 4,
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const getMnemonic = useAppStore((s) => s.getMnemonic);

  useEffect(() => {
    // Generate options
    const otherItems = allItems.filter((i) => i.number !== item.number);
    const wrongOptions = getRandomItems(optionCount - 1, undefined)
      .filter((i) => i.number !== item.number)
      .slice(0, optionCount - 1);

    let opts: string[];
    if (mode === 'number-to-word') {
      opts = [item.word, ...wrongOptions.map((i) => i.word)];
    } else {
      opts = [
        item.number.toString(),
        ...wrongOptions.map((i) => i.number.toString()),
      ];
    }

    // Shuffle options
    setOptions(opts.sort(() => Math.random() - 0.5));
    setSelectedAnswer(null);
    setShowResult(false);
  }, [item, mode, optionCount]);

  const correctAnswer =
    mode === 'number-to-word' ? item.word : item.number.toString();

  const handleSelect = (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === correctAnswer;

    // Show result briefly then move on
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1200);
  };

  const userMnemonic = getMnemonic(item.number);

  return (
    <View style={styles.container}>
      {/* Question */}
      <View style={styles.questionCard}>
        {mode === 'number-to-word' ? (
          <Text style={styles.questionNumber}>{item.number}</Text>
        ) : (
          <View style={styles.questionWordContainer}>
            <Text style={styles.questionEmoji}>{item.emoji}</Text>
            <Text style={styles.questionWord}>{item.word}</Text>
          </View>
        )}
      </View>

      {/* Options */}
      <View style={styles.optionsGrid}>
        {options.map((opt, index) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === correctAnswer;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <Pressable
              key={opt}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                showCorrect && styles.optionCorrect,
                showWrong && styles.optionWrong,
              ]}
              onPress={() => handleSelect(opt)}
              disabled={showResult}
            >
              <Text
                style={[
                  styles.optionText,
                  (showCorrect || showWrong) && styles.optionTextResult,
                ]}
              >
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Show mnemonic hint on wrong answer */}
      {showResult && selectedAnswer !== correctAnswer && userMnemonic && (
        <View style={styles.mnemonicHint}>
          <Text style={styles.mnemonicHintLabel}>Your mnemonic:</Text>
          <Text style={styles.mnemonicHintText}>{userMnemonic}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
  },
  questionCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  questionNumber: {
    fontSize: 72,
    fontWeight: '700',
    color: Colors.accentCyan,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  questionWordContainer: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  questionEmoji: {
    fontSize: 64,
  },
  questionWord: {
    fontSize: theme.fontSizes['3xl'],
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  option: {
    width: '48%',
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      },
    }),
  },
  optionSelected: {
    borderColor: Colors.accentCyan,
    backgroundColor: Colors.bgElevated,
  },
  optionCorrect: {
    borderColor: Colors.success,
    backgroundColor: `${Colors.success}20`,
  },
  optionWrong: {
    borderColor: Colors.error,
    backgroundColor: `${Colors.error}20`,
  },
  optionText: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  optionTextResult: {
    fontWeight: '700',
  },
  mnemonicHint: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentAmber,
  },
  mnemonicHintLabel: {
    fontSize: theme.fontSizes.xs,
    color: Colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  mnemonicHintText: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
