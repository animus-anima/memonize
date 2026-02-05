import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, theme } from '@/constants/Colors';
import { useAppStore, PhaseId } from '@/store/useAppStore';
import { categories } from '@/lib/data';
import { CategoryCard } from '@/components/CategoryCard';
import { ProgressOverview } from '@/components/ProgressOverview';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/useTranslation';

// Child-friendly phase definitions with translation keys
const phases: { id: PhaseId; nameKey: 'discoverPhase' | 'connectPhase' | 'cheatSheetPhase' | 'quizTimePhase' | 'mixItUpPhase' | 'speedRunPhase'; icon: string; descKey: 'discoverDesc' | 'connectDesc' | 'cheatSheetDesc' | 'quizTimeDesc' | 'mixItUpDesc' | 'speedRunDesc'; color: string }[] = [
  { id: 'priming', nameKey: 'discoverPhase', icon: '👀', descKey: 'discoverDesc', color: '#38BDF8' },
  { id: 'encoding', nameKey: 'connectPhase', icon: '🧩', descKey: 'connectDesc', color: '#A78BFA' },
  { id: 'reference', nameKey: 'cheatSheetPhase', icon: '📋', descKey: 'cheatSheetDesc', color: '#4ADE80' },
  { id: 'retrieval', nameKey: 'quizTimePhase', icon: '🎯', descKey: 'quizTimeDesc', color: '#FBBF24' },
  { id: 'interleaving', nameKey: 'mixItUpPhase', icon: '🎲', descKey: 'mixItUpDesc', color: '#F472B6' },
  { id: 'overlearning', nameKey: 'speedRunPhase', icon: '🚀', descKey: 'speedRunDesc', color: '#FB923C' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const currentPhase = useAppStore((s) => s.currentPhase);
  const setCurrentPhase = useAppStore((s) => s.setCurrentPhase);
  const categoryProgress = useAppStore((s) => s.categoryProgress);
  const longestStreak = useAppStore((s) => s.longestStreak);
  const { t } = useTranslation();

  const handlePhaseSelect = (phaseId: PhaseId) => {
    setCurrentPhase(phaseId);
    if (phaseId === 'reference') {
      router.push('/reference');
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/category/${categoryId}?phase=${currentPhase}`);
  };

  const currentPhaseData = phases.find((p) => p.id === currentPhase);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Language Switcher - Top Right */}
      <View style={styles.langSwitcher}>
        <LanguageSwitcher />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Fun Header with mascot feel */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{t('letsLearn')} 🎉</Text>
              <Text style={styles.title}>{t('numberMemory')}</Text>
            </View>
            {longestStreak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakIcon}>🔥</Text>
                <Text style={styles.streakText}>{longestStreak}</Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle}>
            {t('matchNumbers')}
          </Text>
        </View>

        {/* Progress Overview - Gamified */}
        <ProgressOverview />

        {/* Phase Selection - Big friendly buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎮 {t('chooseAdventure')}</Text>
          <View style={styles.phaseGrid}>
            {phases.map((phase, index) => {
              const isActive = phase.id === currentPhase;
              return (
                <Pressable
                  key={phase.id}
                  style={[
                    styles.phaseCard,
                    isActive && styles.phaseCardActive,
                    { borderColor: isActive ? phase.color : Colors.borderSubtle },
                  ]}
                  onPress={() => handlePhaseSelect(phase.id)}
                >
                  <View style={[styles.phaseNumber, { backgroundColor: phase.color }]}>
                    <Text style={styles.phaseNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.phaseIcon}>{phase.icon}</Text>
                  <Text style={[styles.phaseName, isActive && { color: phase.color }]}>
                    {t(phase.nameKey)}
                  </Text>
                  {isActive && (
                    <Text style={styles.phaseDescription}>{t(phase.descKey)}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Current Phase Banner */}
        <View style={[styles.currentPhaseBanner, { backgroundColor: `${currentPhaseData?.color}20`, borderColor: currentPhaseData?.color }]}>
          <Text style={styles.bannerIcon}>{currentPhaseData?.icon}</Text>
          <View style={styles.bannerText}>
            <Text style={[styles.bannerTitle, { color: currentPhaseData?.color }]}>
              {currentPhaseData ? t(currentPhaseData.nameKey) : ''}
            </Text>
            <Text style={styles.bannerDescription}>
              {currentPhaseData ? t(currentPhaseData.descKey) : ''}
            </Text>
          </View>
          <Text style={styles.bannerArrow}>→</Text>
        </View>

        {/* Categories Grid - Colorful cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 {t('pickTopic')}</Text>
          <View style={[styles.grid, isMobile && styles.gridMobile]}>
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                progress={categoryProgress[cat.id]}
                currentPhase={currentPhase}
                onPress={() => handleCategoryPress(cat.id)}
                compact={isMobile}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions - Big colorful buttons */}
        <View style={styles.quickActions}>
          <Pressable
            style={[styles.quickButton, styles.quickButtonPrimary]}
            onPress={() => router.push('/reference')}
          >
            <Text style={styles.quickButtonIcon}>📖</Text>
            <Text style={styles.quickButtonTextPrimary}>{t('seeAll100')}</Text>
          </Pressable>
          <Pressable
            style={[styles.quickButton, styles.quickButtonSecondary]}
            onPress={() => router.push('/quiz/random')}
          >
            <Text style={styles.quickButtonIcon}>🎲</Text>
            <Text style={styles.quickButtonTextSecondary}>{t('randomQuiz')}</Text>
          </Pressable>
        </View>
      </ScrollView>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: theme.fontSizes.lg,
    color: Colors.accentWarning,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    fontSize: theme.fontSizes['4xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.fontSizes.lg,
    color: Colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    gap: 4,
  },
  streakIcon: {
    fontSize: 20,
  },
  streakText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: Colors.accentWarning,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  phaseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  phaseCard: {
    width: '31%',
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
    minHeight: 100,
    ...Platform.select({
      web: { cursor: 'pointer', transition: 'all 0.2s ease' },
    }),
  },
  phaseCardActive: {
    backgroundColor: Colors.bgElevated,
    transform: [{ scale: 1.02 }],
  },
  phaseNumber: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseNumberText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  phaseIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  phaseName: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  phaseDescription: {
    fontSize: theme.fontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  currentPhaseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.radius['2xl'],
    marginBottom: theme.spacing.xl,
    borderWidth: 2,
    gap: theme.spacing.md,
  },
  bannerIcon: {
    fontSize: 48,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: theme.fontSizes['2xl'],
    fontWeight: '700',
  },
  bannerDescription: {
    fontSize: theme.fontSizes.base,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bannerArrow: {
    fontSize: 28,
    color: Colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  gridMobile: {
    gap: theme.spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  quickButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    gap: theme.spacing.sm,
    ...Platform.select({
      web: { cursor: 'pointer', transition: 'transform 0.15s ease' },
    }),
  },
  quickButtonPrimary: {
    backgroundColor: Colors.accentPrimary,
  },
  quickButtonSecondary: {
    backgroundColor: Colors.bgSurface,
    borderWidth: 2,
    borderColor: Colors.accentSecondary,
  },
  quickButtonIcon: {
    fontSize: 24,
  },
  quickButtonTextPrimary: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: Colors.textOnAccent,
  },
  quickButtonTextSecondary: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: Colors.accentSecondary,
  },
});
