import { View, Text, StyleSheet } from 'react-native';
import { Colors, theme, CategoryColors } from '@/constants/Colors';
import { useAppStore } from '@/store/useAppStore';
import { categories } from '@/lib/data';

export function ProgressOverview() {
  const categoryProgress = useAppStore((s) => s.categoryProgress);
  const userMnemonics = useAppStore((s) => s.userMnemonics);
  const currentStreak = useAppStore((s) => s.currentStreak);

  // Calculate overall stats with null safety for migrated data
  const totalMnemonics = Object.keys(userMnemonics).length;
  const validProgress = categories
    .map((cat) => categoryProgress[cat.id])
    .filter((p) => p != null);
  const avgAccuracy =
    validProgress.length > 0
      ? validProgress.reduce((sum, p) => sum + p.retrievalAccuracy, 0) / validProgress.length
      : 0;
  const primedCategories = validProgress.filter((p) => p.primingCompleted).length;

  // Calculate total mastery (simplified for kids)
  const totalItems = 100;
  const masteredItems = Math.round((avgAccuracy / 100) * totalItems);

  return (
    <View style={styles.container}>
      {/* Fun title */}
      <Text style={styles.title}>📊 Your Progress</Text>

      {/* Category progress bars - visual and colorful */}
      <View style={styles.categoryBars}>
        {categories.map((cat) => {
          const progress = categoryProgress[cat.id];
          const color = CategoryColors[cat.id];
          const percent = progress?.retrievalAccuracy ?? 0;

          return (
            <View key={cat.id} style={styles.categoryBarItem}>
              <View style={styles.categoryBarTrack}>
                <View
                  style={[
                    styles.categoryBarFill,
                    {
                      backgroundColor: color,
                      width: `${Math.max(percent, 5)}%`,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Stats as fun cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.statCardPrimary]}>
          <Text style={styles.statEmoji}>🧠</Text>
          <Text style={styles.statValue}>{totalMnemonics}</Text>
          <Text style={styles.statLabel}>Stories Made</Text>
        </View>

        <View style={[styles.statCard, styles.statCardSecondary]}>
          <Text style={styles.statEmoji}>👀</Text>
          <Text style={styles.statValue}>{primedCategories}/10</Text>
          <Text style={styles.statLabel}>Explored</Text>
        </View>

        <View style={[styles.statCard, styles.statCardTertiary]}>
          <Text style={styles.statEmoji}>🎯</Text>
          <Text style={styles.statValue}>{Math.round(avgAccuracy)}%</Text>
          <Text style={styles.statLabel}>Score</Text>
        </View>

        <View style={[styles.statCard, styles.statCardQuaternary]}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statValue}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      {/* Mastery meter - like a game XP bar */}
      <View style={styles.masterySection}>
        <View style={styles.masteryHeader}>
          <Text style={styles.masteryTitle}>⭐ Mastery Level</Text>
          <Text style={styles.masteryCount}>{masteredItems}/100</Text>
        </View>
        <View style={styles.masteryTrack}>
          <View
            style={[
              styles.masteryFill,
              { width: `${masteredItems}%` },
            ]}
          />
        </View>
        <Text style={styles.masteryHint}>
          {masteredItems < 25
            ? 'Keep exploring! 🌱'
            : masteredItems < 50
            ? 'Great start! 🌟'
            : masteredItems < 75
            ? 'Amazing progress! 🚀'
            : masteredItems < 100
            ? 'Almost there! 🏆'
            : 'You are a champion! 👑'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  categoryBars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: theme.spacing.lg,
  },
  categoryBarItem: {
    flex: 1,
  },
  categoryBarTrack: {
    height: 12,
    backgroundColor: Colors.bgElevated,
    borderRadius: 6,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 6,
    minWidth: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    width: '48%',
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
  },
  statCardPrimary: {
    backgroundColor: `${Colors.accentPrimary}15`,
  },
  statCardSecondary: {
    backgroundColor: `${Colors.accentInfo}15`,
  },
  statCardTertiary: {
    backgroundColor: `${Colors.accentSuccess}15`,
  },
  statCardQuaternary: {
    backgroundColor: `${Colors.accentWarning}15`,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: theme.fontSizes['2xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  masterySection: {
    backgroundColor: Colors.bgElevated,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
  },
  masteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  masteryTitle: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  masteryCount: {
    fontSize: theme.fontSizes.base,
    fontWeight: '700',
    color: Colors.gold,
  },
  masteryTrack: {
    height: 16,
    backgroundColor: Colors.bgSurface,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  masteryFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: Colors.gold,
    minWidth: 8,
  },
  masteryHint: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
