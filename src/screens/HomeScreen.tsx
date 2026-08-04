import { LinearGradient } from 'expo-linear-gradient';
import { CompositeNavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HerbCard } from '../components/HerbCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { SearchBar } from '../components/SearchBar';
import { useApp } from '../context/AppContext';
import { getFeatured, getStats } from '../db/database';
import { HerbSummary } from '../db/types';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { t, language, herbCount, isRtl } = useApp();
  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState<HerbSummary[]>([]);
  const [stats, setStats] = useState({ total: herbCount, favorites: 0, online: 0 });

  useFocusEffect(
    useCallback(() => {
      getFeatured(10).then(setFeatured).catch(() => undefined);
      getStats().then(setStats).catch(() => undefined);
    }, []),
  );

  const goSearch = () => {
    navigation.navigate('Search', { initialQuery: query });
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1A3C2A', '#2F6B4F', '#EAF6EF']} style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.brand}>{t.appName}</Text>
              <Text style={[styles.tag, language === 'ur' && styles.urdu, isRtl && styles.rtl]}>
                {t.tagline}
              </Text>
            </View>
            <LanguageToggle />
          </View>

          <Pressable onPress={goSearch}>
            <View pointerEvents="none">
              <SearchBar value={query} onChangeText={setQuery} />
            </View>
          </Pressable>

          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{stats.total.toLocaleString()}</Text>
              <Text style={[styles.statLabel, language === 'ur' && styles.urduSmall]}>
                {t.totalEntries}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{stats.online.toLocaleString()}</Text>
              <Text style={[styles.statLabel, language === 'ur' && styles.urduSmall]}>
                {t.savedOnline}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={featured}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={[styles.section, language === 'ur' && styles.urdu, isRtl && styles.rtl]}>
            {t.featured}
          </Text>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <HerbCard
            herb={item}
            onPress={() => navigation.navigate('Detail', { id: item.id })}
          />
        )}
        ListFooterComponent={
          <Pressable style={styles.exploreBtn} onPress={() => navigation.navigate('Search', {})}>
            <Text style={styles.exploreText}>{t.explore}</Text>
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.sand,
  },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 18,
    marginTop: 8,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 34,
    color: colors.cream,
    marginBottom: 6,
  },
  tag: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.mint,
    lineHeight: 20,
    maxWidth: 220,
  },
  urdu: {
    fontFamily: fonts.urdu,
    fontSize: 16,
    lineHeight: 30,
  },
  urduSmall: {
    fontFamily: fonts.urdu,
    fontSize: 13,
    lineHeight: 24,
  },
  rtl: {
    textAlign: 'right',
    alignSelf: 'stretch',
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,253,248,0.14)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statNum: {
    fontFamily: fonts.displaySoft,
    fontSize: 22,
    color: colors.cream,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.mint,
    marginTop: 2,
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    fontFamily: fonts.displaySoft,
    fontSize: 24,
    color: colors.forest,
    marginBottom: 14,
  },
  exploreBtn: {
    marginTop: 20,
    backgroundColor: colors.forest,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  exploreText: {
    fontFamily: fonts.bodyBold,
    color: colors.cream,
    fontSize: 15,
  },
});
