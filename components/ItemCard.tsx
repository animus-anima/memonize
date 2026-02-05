import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Colors, theme } from '@/constants/Colors';
import { TableItem } from '@/lib/data';
import { useAppStore } from '@/store/useAppStore';

interface ItemCardProps {
  item: TableItem;
  color: string;
  onPress?: () => void;
  viewed?: boolean;
  showDetails?: boolean;
  compact?: boolean;
}

export function ItemCard({
  item,
  color,
  onPress,
  viewed = false,
  showDetails = false,
  compact = false,
}: ItemCardProps) {
  const showEmoji = useAppStore((s) => s.showEmoji);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        viewed && styles.cardViewed,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.numberBadge}>
        <Text style={[styles.number, { color }]}>{item.number}</Text>
      </View>

      {showEmoji && <Text style={styles.emoji}>{item.emoji}</Text>}

      <Text style={styles.word}>{item.word}</Text>

      {viewed && (
        <View style={[styles.viewedIndicator, { backgroundColor: color }]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    position: 'relative',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.15s ease',
      },
    }),
  },
  cardCompact: {
    width: '31%',
    padding: theme.spacing.sm,
  },
  cardViewed: {
    backgroundColor: Colors.bgElevated,
    borderColor: Colors.borderVisible,
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  numberBadge: {
    marginBottom: theme.spacing.xs,
  },
  number: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  emoji: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  word: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: '500',
    textAlign: 'center',
  },
  viewedIndicator: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
