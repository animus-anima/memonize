import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, theme } from '@/constants/Colors';
import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  resetPassword,
} from '@/lib/firebaseClient';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

type AuthMode = 'signin' | 'register' | 'reset';

export default function AuthScreen() {
  const { width } = useWindowDimensions();
  const isWide = width > 600;
  const cardMaxWidth = 440;

  const language = useAppStore((s) => s.language);

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || t('errorOccurred', language));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || (mode !== 'reset' && !password.trim())) {
      setError(t('fillAllFields', language));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email.trim(), password);
      } else if (mode === 'register') {
        if (!displayName.trim()) {
          setError(t('enterYourName', language));
          setLoading(false);
          return;
        }
        await registerWithEmail(email.trim(), password, displayName.trim());
      } else if (mode === 'reset') {
        await resetPassword(email.trim());
        setResetSent(true);
      }
    } catch (err: any) {
      const errorMessage = err.code === 'auth/invalid-credential'
        ? t('invalidCredentials', language)
        : err.code === 'auth/email-already-in-use'
        ? t('emailAlreadyUsed', language)
        : err.code === 'auth/weak-password'
        ? t('weakPassword', language)
        : err.code === 'auth/invalid-email'
        ? t('invalidEmail', language)
        : err.message || t('errorOccurred', language);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setResetSent(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Language Switcher - Top Right */}
      <View style={styles.langSwitcherContainer}>
        <LanguageSwitcher />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isWide && styles.scrollContentWide,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.contentWrapper, isWide && { maxWidth: cardMaxWidth, width: '100%' }]}>
            {/* Logo/Title */}
            <View style={styles.header}>
              <Text style={[styles.logo, isWide && styles.logoWide]}>🧠</Text>
              <Text style={[styles.title, isWide && styles.titleWide]}>{t('appName', language)}</Text>
              <Text style={styles.subtitle}>{t('appTagline', language)}</Text>
            </View>

            {/* Auth Card */}
            <View style={styles.card}>
            {/* Mode Tabs */}
            {mode !== 'reset' && (
              <View style={styles.tabs}>
                <Pressable
                  style={[styles.tab, mode === 'signin' && styles.tabActive]}
                  onPress={() => switchMode('signin')}
                >
                  <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>
                    {t('signIn', language)}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.tab, mode === 'register' && styles.tabActive]}
                  onPress={() => switchMode('register')}
                >
                  <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                    {t('register', language)}
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Reset Password Title */}
            {mode === 'reset' && (
              <Text style={styles.resetTitle}>{t('resetPassword', language)}</Text>
            )}

            {/* Reset Sent Message */}
            {resetSent ? (
              <View style={styles.resetSentContainer}>
                <Text style={styles.resetSentEmoji}>✉️</Text>
                <Text style={styles.resetSentText}>
                  {t('checkEmailReset', language)}
                </Text>
                <Pressable
                  style={styles.backButton}
                  onPress={() => switchMode('signin')}
                >
                  <Text style={styles.backButtonText}>{t('backToSignIn', language)}</Text>
                </Pressable>
              </View>
            ) : (
              <>
                {/* Name Field (Register only) */}
                {mode === 'register' && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('name', language)}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={t('yourName', language)}
                      placeholderTextColor={Colors.textMuted}
                      value={displayName}
                      onChangeText={setDisplayName}
                      autoCapitalize="words"
                    />
                  </View>
                )}

                {/* Email Field */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>{t('email', language)}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="email@example.com"
                    placeholderTextColor={Colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Password Field (not for reset) */}
                {mode !== 'reset' && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('password', language)}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={t('yourPassword', language)}
                      placeholderTextColor={Colors.textMuted}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                )}

                {/* Error Message */}
                {error && <Text style={styles.error}>{error}</Text>}

                {/* Submit Button */}
                <Pressable
                  style={[styles.submitButton, loading && styles.buttonDisabled]}
                  onPress={handleEmailAuth}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.textPrimary} />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {mode === 'signin' ? t('signIn', language) : mode === 'register' ? t('createAccount', language) : t('sendResetEmail', language)}
                    </Text>
                  )}
                </Pressable>

                {/* Forgot Password Link */}
                {mode === 'signin' && (
                  <Pressable onPress={() => switchMode('reset')}>
                    <Text style={styles.forgotPassword}>{t('forgotPassword', language)}</Text>
                  </Pressable>
                )}

                {/* Back to Sign In (from reset) */}
                {mode === 'reset' && (
                  <Pressable onPress={() => switchMode('signin')}>
                    <Text style={styles.forgotPassword}>{t('backToSignIn', language)}</Text>
                  </Pressable>
                )}

                {/* Divider */}
                {mode !== 'reset' && (
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>{t('or', language)}</Text>
                    <View style={styles.dividerLine} />
                  </View>
                )}

                {/* Google Sign In */}
                {mode !== 'reset' && (
                  <Pressable
                    style={[styles.googleButton, loading && styles.buttonDisabled]}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <Text style={styles.googleIcon}>G</Text>
                    <Text style={styles.googleButtonText}>{t('continueWithGoogle', language)}</Text>
                  </Pressable>
                )}
              </>
            )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  langSwitcherContainer: {
    position: 'absolute',
    top: 50,
    right: theme.spacing.lg,
    zIndex: 100,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  scrollContentWide: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  contentWrapper: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logo: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  logoWide: {
    fontSize: 80,
  },
  title: {
    fontSize: theme.fontSizes['3xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  titleWide: {
    fontSize: 36,
  },
  subtitle: {
    fontSize: theme.fontSizes.base,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.bgElevated,
    borderRadius: theme.radius.lg,
    padding: 4,
    marginBottom: theme.spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.radius.md,
  },
  tabActive: {
    backgroundColor: Colors.bgSurface,
  },
  tabText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  resetTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: Colors.bgElevated,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  error: {
    color: Colors.error,
    fontSize: theme.fontSizes.sm,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  submitButton: {
    backgroundColor: Colors.accentPrimary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  submitButtonText: {
    fontSize: theme.fontSizes.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  forgotPassword: {
    fontSize: theme.fontSizes.sm,
    color: Colors.accentInfo,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderSubtle,
  },
  dividerText: {
    color: Colors.textMuted,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.fontSizes.sm,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgElevated,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderVisible,
  },
  googleIcon: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: '#4285F4',
    marginRight: theme.spacing.sm,
  },
  googleButtonText: {
    fontSize: theme.fontSizes.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  resetSentContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  resetSentEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  resetSentText: {
    fontSize: theme.fontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    paddingVertical: theme.spacing.sm,
  },
  backButtonText: {
    fontSize: theme.fontSizes.sm,
    color: Colors.accentInfo,
  },
});
