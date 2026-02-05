import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, theme } from '@/constants/Colors';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔍</Text>
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.subtitle}>
        This page doesn't exist in our memory palace.
      </Text>
      <Pressable style={styles.button} onPress={() => router.replace('/')}>
        <Text style={styles.buttonText}>Go Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSizes['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  button: {
    backgroundColor: Colors.accentCyan,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
  },
  buttonText: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: Colors.textInverse,
  },
});
