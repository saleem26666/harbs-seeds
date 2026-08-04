import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Network from 'expo-network';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HerbCard } from '../components/HerbCard';
import { SearchBar } from '../components/SearchBar';
import { useApp } from '../context/AppContext';
import { searchHerbs } from '../db/database';
import {
  getPreferredOnlineQuery,
  isStrongSearchMatch,
} from '../db/searchAliases';
import { Herb, HerbSummary } from '../db/types';
import { RootStackParamList } from '../navigation/types';
import { withTimeout } from '../services/http';
import { searchAndCacheOnline } from '../services/onlineSearch';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const ONLINE_SEARCH_MS = 12000;

export function SearchScreen({ navigation, route }: Props) {
  const { t, language, isRtl } = useApp();
  const [query, setQuery] = useState(route.params?.initialQuery ?? '');
  const [results, setResults] = useState<HerbSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [onlineHerb, setOnlineHerb] = useState<Herb | null>(null);
  const [onlineStatus, setOnlineStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const handle = setTimeout(async () => {
      setLoading(true);
      setOnlineHerb(null);
      setOnlineStatus(null);
      try {
        const trimmed = query.trim();
        if (!trimmed) {
          const local = await searchHerbs('', 50);
          if (!cancelled) setResults(local);
          return;
        }

        const local = await searchHerbs(trimmed, 50);
        if (cancelled) return;

        const strongLocal = local.filter((item) => isStrongSearchMatch(trimmed, item));
        const ranked = [
          ...strongLocal,
          ...local.filter((item) => !strongLocal.some((s) => s.id === item.id)),
        ];
        setResults(ranked);

        if (strongLocal.length > 0) return;
        if (trimmed.length < 2) return;

        // Always attempt internet when no strong local match.
        setOnlineStatus(t.searchingOnline);

        let offline = false;
        try {
          const state = await Network.getNetworkStateAsync();
          offline = state.isConnected === false;
        } catch {
          offline = false; // still try fetch
        }

        if (offline) {
          if (!cancelled) {
            setOnlineStatus(t.networkNeeded);
            if (ranked.length === 0) setResults([]);
          }
          return;
        }

        const onlineQuery = getPreferredOnlineQuery(trimmed);
        const found = await withTimeout(
          searchAndCacheOnline(onlineQuery).catch(() =>
            searchAndCacheOnline(trimmed).catch(() => null),
          ),
          ONLINE_SEARCH_MS,
          null,
        );

        if (cancelled) return;

        if (found) {
          setOnlineHerb(found);
          setOnlineStatus(t.foundOnline);
          setResults((prev) => {
            if (prev.some((p) => p.id === found.id)) return prev;
            return [found, ...prev];
          });
        } else {
          setOnlineStatus(ranked.length === 0 ? t.onlineFail : null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, t]);

  const header = useMemo(
    () => (
      <View style={styles.headerBlock}>
        {loading ? <ActivityIndicator color={colors.leaf} style={{ marginBottom: 10 }} /> : null}
        {onlineStatus ? (
          <Text style={[styles.status, language === 'ur' && styles.urdu, isRtl && styles.rtl]}>
            {onlineStatus}
          </Text>
        ) : null}
        {!loading && results.length === 0 && query.trim() ? (
          <Text style={[styles.empty, language === 'ur' && styles.urdu, isRtl && styles.rtl]}>
            {t.noResults}
          </Text>
        ) : null}
      </View>
    ),
    [loading, onlineStatus, results.length, query, t, language, isRtl],
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} autoFocus />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={header}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <HerbCard
            herb={item}
            onPress={() => navigation.navigate('Detail', { id: item.id })}
          />
        )}
        ListFooterComponent={
          onlineHerb ? (
            <Text style={styles.footerNote}>{t.sourceOnline}</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.sand,
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerBlock: {
    marginBottom: 8,
  },
  status: {
    fontFamily: fonts.bodyMedium,
    color: colors.leaf,
    marginBottom: 8,
  },
  empty: {
    fontFamily: fonts.body,
    color: colors.mute,
  },
  urdu: {
    fontFamily: fonts.urdu,
    fontSize: 16,
    lineHeight: 30,
  },
  rtl: {
    textAlign: 'right',
  },
  footerNote: {
    marginTop: 16,
    fontFamily: fonts.body,
    color: colors.mute,
    fontSize: 12,
    textAlign: 'center',
  },
});
