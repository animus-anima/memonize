import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Colors, theme } from '@/constants/Colors';
import { useAppStore } from '@/store/useAppStore';
import { Language } from '@/lib/i18n';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export function LanguageSwitcher() {
  const { width } = useWindowDimensions();
  const isCompact = width < 400;
  const [isOpen, setIsOpen] = useState(false);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const currentLang = languages.find((l) => l.code === language) || languages[1];

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.trigger}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.flag}>{currentLang.flag}</Text>
        {!isCompact && <Text style={styles.langCode}>{currentLang.code.toUpperCase()}</Text>}
        <Text style={styles.chevron}>▼</Text>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.dropdown}>
            {languages.map((lang) => (
              <Pressable
                key={lang.code}
                style={[
                  styles.option,
                  language === lang.code && styles.optionActive,
                ]}
                onPress={() => handleSelect(lang.code)}
              >
                <Text style={styles.optionFlag}>{lang.flag}</Text>
                <Text style={[
                  styles.optionLabel,
                  language === lang.code && styles.optionLabelActive,
                ]}>
                  {lang.label}
                </Text>
                {language === lang.code && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: 6,
  },
  flag: {
    fontSize: 18,
  },
  langCode: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chevron: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: theme.spacing.lg,
  },
  dropdown: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    overflow: 'hidden',
    minWidth: 160,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  optionActive: {
    backgroundColor: Colors.bgElevated,
  },
  optionFlag: {
    fontSize: 20,
  },
  optionLabel: {
    flex: 1,
    fontSize: theme.fontSizes.base,
    color: Colors.textPrimary,
  },
  optionLabelActive: {
    fontWeight: '600',
  },
  checkmark: {
    fontSize: theme.fontSizes.base,
    color: Colors.accentLime,
    fontWeight: '700',
  },
});
