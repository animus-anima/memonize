import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Colors, theme, CategoryColors, CategoryEmojis } from '@/constants/Colors';
import { Category } from '@/lib/data';
import { CategoryProgress, PhaseId } from '@/store/useAppStore';

interface CategoryCardProps {
  category: Category;
  progress: CategoryProgress;
  currentPhase: PhaseId;
  onPress: () => void;
  compact?: boolean;
}

export function CategoryCard({
  category,
  progress,
  currentPhase,
  onPress,
  compact = false,
}: CategoryCardProps) {
  const color = CategoryColors[category.id] || Colors.accentPrimary;
  const emoji = CategoryEmojis[category.id] || '📦';

  // Calculate progress percentage based on current phase
  const getProgressPercent = () => {
    // Guard against undefined progress
    if (!progress) return 0;
    
    switch (currentPhase) {
      case 'priming':
        return progress.primingCompleted ? 100 : 0;
      case 'encoding':
        return (progress.encodingCount / 10) * 100;
      case 'retrieval':
      case 'interleaving':
      case 'overlearning':
        return progress.retrievalAccuracy;
      default:
        return 0;
    }
  };

  const progressPercent = getProgressPercent();
  const isComplete = progressPercent === 100;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        pressed && styles.cardPressed,
        { borderColor: color },
      ]}
      onPress={onPress}
    >
      {/* Colorful top accent bar */}
      <View style={[styles.accentBar, { backgroundColor: color }]} />

      {/* Progress bar background */}
      <View
        style={[
          styles.progressBar,
          { backgroundColor: `${color}25`, width: `${progressPercent}%` },
        ]}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Big emoji for visual recognition */}
        <Text style={styles.emoji}>{emoji}</Text>

        {/* Category name - larger, friendlier */}
        <Text style={[styles.name, { color }]}>{category.name}</Text>
        <Text style={styles.nameEn}>{category.nameEn}</Text>

        {/* Number range badge */}
        <View style={[styles.rangeBadge, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.rangeText, { color }]}>{category.range}</Text>
        </View>

        {/* Progress indicator */}
        <View style={styles.footer}>
          {isComplete ? (
            <View style={styles.completeBadge}>
              <Text style={styles.completeIcon}>⭐</Text>
              <Text style={styles.completeText}>Done!</Text>
            </View>
          ) : progressPercent > 0 ? (
            <View style={styles.progressIndicator}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercent}%`, backgroundColor: color },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{Math.round(progressPercent)}%</Text>
            </View>
          ) : (
            <Text style={styles.startText}>Tap to start! →</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius['2xl'],
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      },
    }),
  },
  cardCompact: {
    width: '48%',
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
  },
  accentBar: {
    height: 6,
    width: '100%',
  },
  progressBar: {
    position: 'absolute',
    top: 6,
    left: 0,
    bottom: 0,
    borderBottomLeftRadius: theme.radius['2xl'],
    borderBottomRightRadius: theme.radius['2xl'],
  },
  content: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    position: 'relative',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
    marginBottom: theme.spacing.sm,
  },
  name: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  nameEn: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  rangeBadge: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
  },
  rangeText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  footer: {
    marginTop: theme.spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completeIcon: {
    fontSize: 16,
  },
  completeText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '700',
    color: Colors.accentSuccess,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    width: '100%',
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.bgElevated,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    minWidth: 36,
    textAlign: 'right',
  },
  startText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: Colors.textMuted,
  },
});
