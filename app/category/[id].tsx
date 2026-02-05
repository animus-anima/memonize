import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, theme, CategoryColors } from '@/constants/Colors';
import { useAppStore, PhaseId } from '@/store/useAppStore';
import {
  getCategoryById,
  getItemsByCategory,
  TableItem,
  getRandomItems,
} from '@/lib/data';
import { ItemCard } from '@/components/ItemCard';
import { QuizCard } from '@/components/QuizCard';
import { BackButton } from '@/components/BackButton';
import { useTranslation } from '@/lib/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function CategoryScreen() {
  const { id, phase } = useLocalSearchParams<{ id: string; phase?: PhaseId }>();
  const router = useRouter();
  const { t } = useTranslation();
  const currentPhase = useAppStore((s) => s.currentPhase);
  const markPrimingComplete = useAppStore((s) => s.markPrimingComplete);
  const categoryProgress = useAppStore((s) => s.categoryProgress);

  const activePhase = (phase as PhaseId) || currentPhase;
  const category = getCategoryById(id);
  const items = getItemsByCategory(id);
  const color = CategoryColors[id] || Colors.accentCyan;

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Category not found</Text>
      </SafeAreaView>
    );
  }

  const progress = categoryProgress[id];

  const renderPhaseContent = () => {
    switch (activePhase) {
      case 'priming':
        return (
          <PrimingPhase
            items={items}
            color={color}
            category={category}
            onComplete={() => markPrimingComplete(id)}
            isComplete={progress?.primingCompleted}
          />
        );
      case 'encoding':
        return <EncodingPhase items={items} color={color} />;
      case 'retrieval':
        return <RetrievalPhase items={items} categoryId={id} />;
      case 'interleaving':
        return <InterleavingPhase categoryId={id} />;
      case 'overlearning':
        return <OverlearningPhase items={items} categoryId={id} />;
      default:
        return <PrimingPhase items={items} color={color} category={category} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Language Switcher */}
      <View style={styles.langSwitcher}>
        <LanguageSwitcher />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerContent}>
            <View style={[styles.colorBadge, { backgroundColor: color }]} />
            <View>
              <Text style={styles.title}>{category.name}</Text>
              <Text style={styles.subtitle}>
                {category.nameEn} • {category.range}
              </Text>
            </View>
          </View>
          <Text style={styles.description}>{category.description}</Text>
        </View>

        {/* Phase-specific content */}
        {renderPhaseContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ PRIMING PHASE ============
function PrimingPhase({
  items,
  color,
  category,
  onComplete,
  isComplete,
}: {
  items: TableItem[];
  color: string;
  category: any;
  onComplete?: () => void;
  isComplete?: boolean;
}) {
  const { t } = useTranslation();
  const [viewedItems, setViewedItems] = useState<Set<number>>(new Set());

  const handleItemView = (num: number) => {
    setViewedItems((prev) => new Set([...prev, num]));
  };

  const allViewed = viewedItems.size === items.length;

  useEffect(() => {
    if (allViewed && onComplete && !isComplete) {
      onComplete();
    }
  }, [allViewed, onComplete, isComplete]);

  return (
    <View style={styles.phaseContainer}>
      <View style={styles.phaseHeader}>
        <Text style={styles.phaseTitle}>🧠 {t('priming')}</Text>
        <Text style={styles.phaseSubtitle}>
          {t('primingDesc')}
        </Text>
      </View>

      {isComplete && (
        <View style={[styles.completeBadge, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.completeBadgeText, { color }]}>
            ✓ {t('categoryPrimed')}
          </Text>
        </View>
      )}

      <View style={styles.itemsGrid}>
        {items.map((item) => (
          <ItemCard
            key={item.number}
            item={item}
            color={color}
            onPress={() => handleItemView(item.number)}
            viewed={viewedItems.has(item.number)}
            showDetails
          />
        ))}
      </View>

      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          {viewedItems.size}/{items.length} {t('explored')}
        </Text>
      </View>
    </View>
  );
}

// ============ ENCODING PHASE ============
function EncodingPhase({ items, color }: { items: TableItem[]; color: string }) {
  const { t } = useTranslation();
  const setMnemonic = useAppStore((s) => s.setMnemonic);
  const getMnemonic = useAppStore((s) => s.getMnemonic);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleSaveMnemonic = (num: number) => {
    if (inputValue.trim()) {
      setMnemonic(num, inputValue.trim());
      setInputValue('');
      setActiveItem(null);
    }
  };

  return (
    <View style={styles.phaseContainer}>
      <View style={styles.phaseHeader}>
        <Text style={styles.phaseTitle}>🔗 {t('encoding')}</Text>
        <Text style={styles.phaseSubtitle}>
          {t('encodingDesc')}
        </Text>
      </View>

      <View style={styles.itemsList}>
        {items.map((item) => {
          const existingMnemonic = getMnemonic(item.number);
          const isActive = activeItem === item.number;

          return (
            <Pressable
              key={item.number}
              style={[
                styles.encodingItem,
                isActive && styles.encodingItemActive,
              ]}
              onPress={() => {
                setActiveItem(isActive ? null : item.number);
                setInputValue(existingMnemonic || '');
              }}
            >
              <View style={styles.encodingItemHeader}>
                <Text style={styles.encodingNumber}>{item.number}</Text>
                <Text style={styles.encodingEmoji}>{item.emoji}</Text>
                <Text style={styles.encodingWord}>{item.word}</Text>
                {existingMnemonic && (
                  <View style={[styles.hasMnemonicDot, { backgroundColor: color }]} />
                )}
              </View>

              {isActive && (
                <Pressable
                  style={styles.mnemonicInput}
                  onPress={(e) => e.stopPropagation()}
                >
                  <Text style={styles.mnemonicPrompt}>
                    {t('whyFeelsLike', { number: item.number, word: item.word })}
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    value={inputValue}
                    onChangeText={setInputValue}
                    placeholder={t('mnemonicPlaceholder')}
                    placeholderTextColor={Colors.textMuted}
                    multiline
                  />
                  <Pressable
                    style={[styles.saveButton, { backgroundColor: color }]}
                    onPress={() => handleSaveMnemonic(item.number)}
                  >
                    <Text style={styles.saveButtonText}>{t('save')}</Text>
                  </Pressable>
                </Pressable>
              )}

              {!isActive && existingMnemonic && (
                <Text style={styles.existingMnemonic}>{existingMnemonic}</Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ============ RETRIEVAL PHASE ============
function RetrievalPhase({
  items,
  categoryId,
}: {
  items: TableItem[];
  categoryId: string;
}) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'number-to-word' | 'word-to-number'>('number-to-word');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<TableItem[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const updateStreak = useAppStore((s) => s.updateStreak);
  const updateCategoryProgress = useAppStore((s) => s.updateCategoryProgress);

  useEffect(() => {
    setShuffledItems([...items].sort(() => Math.random() - 0.5));
  }, []);

  const currentItem = shuffledItems[currentIndex];

  const handleAnswer = (correct: boolean) => {
    updateStreak(correct);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    if (currentIndex < shuffledItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const accuracy = Math.round(
        ((score.correct + (correct ? 1 : 0)) / (score.total + 1)) * 100
      );
      updateCategoryProgress(categoryId, { retrievalAccuracy: accuracy });
    }
  };

  if (!currentItem) {
    return (
      <View style={styles.phaseContainer}>
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  const isComplete = currentIndex >= shuffledItems.length - 1 && score.total > 0;

  return (
    <View style={styles.phaseContainer}>
      <View style={styles.phaseHeader}>
        <Text style={styles.phaseTitle}>🎯 {t('retrieval')}</Text>
        <Text style={styles.phaseSubtitle}>
          {t('retrievalDesc')}
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

      {/* Progress */}
      <View style={styles.quizProgress}>
        <Text style={styles.quizProgressText}>
          {currentIndex + 1} / {shuffledItems.length}
        </Text>
        <Text style={styles.quizScoreText}>
          {t('score')}: {score.correct}/{score.total}
        </Text>
      </View>

      {/* Quiz card */}
      {!isComplete ? (
        <QuizCard
          item={currentItem}
          mode={mode}
          allItems={items}
          onAnswer={handleAnswer}
        />
      ) : (
        <View style={styles.quizComplete}>
          <Text style={styles.quizCompleteEmoji}>🎉</Text>
          <Text style={styles.quizCompleteText}>{t('categoryComplete')}</Text>
          <Text style={styles.quizCompleteScore}>
            {t('finalScore')}: {score.correct}/{score.total} (
            {Math.round((score.correct / score.total) * 100)}%)
          </Text>
          <Pressable
            style={styles.restartButton}
            onPress={() => {
              setShuffledItems([...items].sort(() => Math.random() - 0.5));
              setCurrentIndex(0);
              setScore({ correct: 0, total: 0 });
            }}
          >
            <Text style={styles.restartButtonText}>{t('practiceAgain')}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ============ INTERLEAVING PHASE ============
function InterleavingPhase({ categoryId }: { categoryId: string }) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.phaseContainer}>
      <View style={styles.phaseHeader}>
        <Text style={styles.phaseTitle}>🔀 {t('interleaving')}</Text>
        <Text style={styles.phaseSubtitle}>
          {t('interleavingDesc')}
        </Text>
      </View>

      <View style={styles.interleavingOptions}>
        <Pressable
          style={styles.interleavingCard}
          onPress={() => router.push('/quiz/random')}
        >
          <Text style={styles.interleavingIcon}>🎲</Text>
          <Text style={styles.interleavingTitle}>{t('randomMix')}</Text>
          <Text style={styles.interleavingDesc}>
            {t('randomMixDesc')}
          </Text>
        </Pressable>

        <Pressable
          style={styles.interleavingCard}
          onPress={() => router.push('/quiz/neighbors')}
        >
          <Text style={styles.interleavingIcon}>↔️</Text>
          <Text style={styles.interleavingTitle}>{t('neighbors')}</Text>
          <Text style={styles.interleavingDesc}>
            {t('neighborsDesc')}
          </Text>
        </Pressable>

        <Pressable
          style={styles.interleavingCard}
          onPress={() => router.push('/quiz/odd-one-out')}
        >
          <Text style={styles.interleavingIcon}>🔍</Text>
          <Text style={styles.interleavingTitle}>{t('oddOneOut')}</Text>
          <Text style={styles.interleavingDesc}>
            {t('oddOneOutDesc')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ============ OVERLEARNING PHASE ============
function OverlearningPhase({
  items,
  categoryId,
}: {
  items: TableItem[];
  categoryId: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const getBestSpeed = useAppStore((s) => s.getBestSpeed);
  const bestSprint = getBestSpeed('sprint');

  return (
    <View style={styles.phaseContainer}>
      <View style={styles.phaseHeader}>
        <Text style={styles.phaseTitle}>⚡ {t('overlearning')}</Text>
        <Text style={styles.phaseSubtitle}>
          {t('overlearningDesc')}
        </Text>
      </View>

      {bestSprint && (
        <View style={styles.bestRecord}>
          <Text style={styles.bestRecordLabel}>{t('bestSprint')}</Text>
          <Text style={styles.bestRecordValue}>
            {bestSprint.count} in {(bestSprint.timeMs / 1000).toFixed(1)}s
          </Text>
        </View>
      )}

      <View style={styles.speedOptions}>
        <Pressable
          style={styles.speedCard}
          onPress={() => router.push(`/speed/sprint?category=${categoryId}`)}
        >
          <Text style={styles.speedIcon}>🏃</Text>
          <Text style={styles.speedTitle}>{t('sprint60s')}</Text>
          <Text style={styles.speedDesc}>
            {t('sprint60sDesc')}
          </Text>
        </Pressable>

        <Pressable
          style={styles.speedCard}
          onPress={() => router.push(`/speed/rapid?category=${categoryId}`)}
        >
          <Text style={styles.speedIcon}>⚡</Text>
          <Text style={styles.speedTitle}>{t('rapidFire')}</Text>
          <Text style={styles.speedDesc}>
            {t('rapidFireDesc')}
          </Text>
        </Pressable>
      </View>
    </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  colorBadge: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes['3xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.fontSizes.base,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  description: {
    fontSize: theme.fontSizes.base,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  errorText: {
    color: Colors.error,
    fontSize: theme.fontSizes.lg,
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: theme.fontSizes.lg,
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
  },
  phaseContainer: {
    flex: 1,
  },
  phaseHeader: {
    marginBottom: theme.spacing.xl,
  },
  phaseTitle: {
    fontSize: theme.fontSizes['2xl'],
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  phaseSubtitle: {
    fontSize: theme.fontSizes.base,
    color: Colors.textSecondary,
  },
  completeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    marginBottom: theme.spacing.lg,
  },
  completeBadgeText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  progressInfo: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  progressText: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textMuted,
  },
  // Encoding styles
  itemsList: {
    gap: theme.spacing.sm,
  },
  encodingItem: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  encodingItemActive: {
    borderColor: Colors.accentCyan,
  },
  encodingItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  encodingNumber: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    width: 32,
  },
  encodingEmoji: {
    fontSize: 24,
  },
  encodingWord: {
    fontSize: theme.fontSizes.lg,
    color: Colors.textPrimary,
    flex: 1,
  },
  hasMnemonicDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mnemonicInput: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  mnemonicPrompt: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: Colors.bgElevated,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    color: Colors.textPrimary,
    fontSize: theme.fontSizes.base,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.sm,
  },
  saveButtonText: {
    color: Colors.textInverse,
    fontWeight: '600',
    fontSize: theme.fontSizes.sm,
  },
  existingMnemonic: {
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  // Quiz styles
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
  quizProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  quizProgressText: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textMuted,
  },
  quizScoreText: {
    fontSize: theme.fontSizes.sm,
    color: Colors.accentLime,
    fontWeight: '600',
  },
  quizComplete: {
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  quizCompleteEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  quizCompleteText: {
    fontSize: theme.fontSizes['2xl'],
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  quizCompleteScore: {
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
  // Interleaving styles
  interleavingOptions: {
    gap: theme.spacing.md,
  },
  interleavingCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  interleavingIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  interleavingTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  interleavingDesc: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textSecondary,
  },
  // Speed styles
  bestRecord: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentLime,
  },
  bestRecordLabel: {
    fontSize: theme.fontSizes.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  bestRecordValue: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: Colors.accentLime,
  },
  speedOptions: {
    gap: theme.spacing.md,
  },
  speedCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  speedIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  speedTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  speedDesc: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textSecondary,
  },
});
