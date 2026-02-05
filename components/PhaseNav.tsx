import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Colors, theme } from '@/constants/Colors';
import { PhaseId } from '@/store/useAppStore';

interface Phase {
  id: PhaseId;
  name: string;
  icon: string;
  description: string;
}

interface PhaseNavProps {
  phases: Phase[];
  currentPhase: PhaseId;
  onPhaseSelect: (phaseId: PhaseId) => void;
}

export function PhaseNav({ phases, currentPhase, onPhaseSelect }: PhaseNavProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {phases.map((phase, index) => {
        const isActive = phase.id === currentPhase;
        return (
          <Pressable
            key={phase.id}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onPhaseSelect(phase.id)}
          >
            <Text style={styles.chipNumber}>{index + 1}</Text>
            <Text style={styles.chipIcon}>{phase.icon}</Text>
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {phase.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: theme.spacing.xs,
  },
  chipActive: {
    backgroundColor: Colors.accentCyan,
    borderColor: Colors.accentCyan,
  },
  chipNumber: {
    fontSize: theme.fontSizes.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    width: 16,
    height: 16,
    textAlign: 'center',
    lineHeight: 16,
    backgroundColor: Colors.bgElevated,
    borderRadius: 8,
    overflow: 'hidden',
  },
  chipIcon: {
    fontSize: 16,
  },
  chipText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.textInverse,
    fontWeight: '600',
  },
});
