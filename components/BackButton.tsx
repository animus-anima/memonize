import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, theme } from '@/constants/Colors';

export function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={() => router.back()}
    >
      <Text style={styles.arrow}>←</Text>
      <Text style={styles.text}>Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  buttonPressed: {
    opacity: 0.7,
  },
  arrow: {
    fontSize: theme.fontSizes.lg,
    color: Colors.textSecondary,
  },
  text: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textSecondary,
  },
});
