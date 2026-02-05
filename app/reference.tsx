import { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, theme, CategoryColors } from '@/constants/Colors';
import { tableItems, categories, TableItem, Category } from '@/lib/data';
import { BackButton } from '@/components/BackButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/lib/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function ReferenceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const showEmoji = useAppStore((s) => s.showEmoji);
  const getMnemonic = useAppStore((s) => s.getMnemonic);
  const { t, language } = useTranslation();

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    let items = tableItems;

    // Filter by category
    if (selectedCategory) {
      items = items.filter((item) => item.categoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.word.toLowerCase().includes(query) ||
          item.number.toString().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    return items;
  }, [searchQuery, selectedCategory]);

  // Group items by category for display
  const groupedItems = useMemo(() => {
    if (selectedCategory) {
      return { [selectedCategory]: filteredItems };
    }

    return filteredItems.reduce((acc, item) => {
      if (!acc[item.categoryId]) {
        acc[item.categoryId] = [];
      }
      acc[item.categoryId].push(item);
      return acc;
    }, {} as Record<string, TableItem[]>);
  }, [filteredItems, selectedCategory]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Language Switcher - Top Right */}
      <View style={styles.langSwitcher}>
        <LanguageSwitcher />
      </View>

      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>{t('referenceTitle')}</Text>
        <Text style={styles.subtitle}>{t('quickLookup')}</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('searchPlaceholder')}
          placeholderTextColor={Colors.textMuted}
        />
        {searchQuery.length > 0 && (
          <Pressable
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </Pressable>
        )}
      </View>

      {/* Category filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
        contentContainerStyle={styles.categoryFilterContent}
      >
        <Pressable
          style={[
            styles.categoryChip,
            !selectedCategory && styles.categoryChipActive,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.categoryChipText,
              !selectedCategory && styles.categoryChipTextActive,
            ]}
          >
            {t('all')}
          </Text>
        </Pressable>
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            style={[
              styles.categoryChip,
              selectedCategory === cat.id && styles.categoryChipActive,
              selectedCategory === cat.id && {
                backgroundColor: CategoryColors[cat.id],
              },
            ]}
            onPress={() =>
              setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
            }
          >
            <View
              style={[
                styles.categoryChipDot,
                { backgroundColor: CategoryColors[cat.id] },
                selectedCategory === cat.id && { backgroundColor: Colors.textInverse },
              ]}
            />
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === cat.id && styles.categoryChipTextActive,
              ]}
            >
              {t(cat.id as any)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Results count */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {filteredItems.length} {t('item')}{filteredItems.length !== 1 && language === 'en' ? 's' : (filteredItems.length > 1 && language === 'fr' ? 's' : '')}
        </Text>
      </View>

      {/* Items list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedItems).map(([categoryId, items]) => {
          const category = categories.find((c) => c.id === categoryId);
          const color = CategoryColors[categoryId];

          return (
            <View key={categoryId} style={styles.categorySection}>
              {!selectedCategory && (
                <View style={styles.categorySectionHeader}>
                  <View
                    style={[styles.categorySectionDot, { backgroundColor: color }]}
                  />
                  <Text style={styles.categorySectionTitle}>
                    {category ? t(category.id as any) : ''} ({category?.range})
                  </Text>
                </View>
              )}

              <View style={styles.itemsTable}>
                {items.map((item) => {
                  const mnemonic = getMnemonic(item.number);

                  return (
                    <View key={item.number} style={styles.tableRow}>
                      <Text style={[styles.tableNumber, { color }]}>
                        {item.number}
                      </Text>
                      {showEmoji && (
                        <Text style={styles.tableEmoji}>{item.emoji}</Text>
                      )}
                      <View style={styles.tableWordContainer}>
                        <Text style={styles.tableWord}>{item.word}</Text>
                        {mnemonic && (
                          <Text style={styles.tableMnemonic}>{mnemonic}</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        {filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>{t('noItemsFound')}</Text>
            <Text style={styles.emptySubtext}>
              {t('tryDifferentSearch')}
            </Text>
          </View>
        )}
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
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSizes['3xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSizes.base,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSizes.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  clearButton: {
    position: 'absolute',
    right: theme.spacing.lg + theme.spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  clearButtonText: {
    fontSize: 24,
    color: Colors.textMuted,
  },
  categoryFilter: {
    maxHeight: 44,
    marginBottom: theme.spacing.md,
  },
  categoryFilterContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    gap: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: Colors.accentCyan,
  },
  categoryChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryChipText: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: Colors.textInverse,
  },
  resultsInfo: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  resultsText: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textMuted,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  categorySection: {
    marginBottom: theme.spacing.xl,
  },
  categorySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  categorySectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categorySectionTitle: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemsTable: {
    backgroundColor: Colors.bgSurface,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  tableNumber: {
    width: 40,
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  tableEmoji: {
    width: 36,
    fontSize: 22,
    textAlign: 'center',
  },
  tableWordContainer: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  tableWord: {
    fontSize: theme.fontSizes.base,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  tableMnemonic: {
    fontSize: theme.fontSizes.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.fontSizes.lg,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: theme.fontSizes.sm,
    color: Colors.textMuted,
    marginTop: theme.spacing.xs,
  },
});
