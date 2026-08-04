import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HerbCard } from '../components/HerbCard';
import { useApp } from '../context/AppContext';
import { getFavorites } from '../db/database';
import { HerbSummary } from '../db/types';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export function FavoritesScreen() {
  const { t, language, isRtl } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<HerbSummary[]>([]);

  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setItems).catch(() => undefined);
    }, []),
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Text style={[styles.title, language === 'ur' && styles.urdu, isRtl && styles.rtl]}>
        {t.favorites}
      </Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <Text style={[styles.empty, language === 'ur' && styles.urdu, isRtl && styles.rtl]}>
            {t.emptyFavorites}
          </Text>
        }
        renderItem={({ item }) => (
          <HerbCard
            herb={item}
            onPress={() => navigation.navigate('Detail', { id: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.sand,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.forest,
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 8,
  },
  list: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  empty: {
    fontFamily: fonts.body,
    color: colors.mute,
    fontSize: 15,
    marginTop: 40,
    lineHeight: 22,
  },
  urdu: {
    fontFamily: fonts.urdu,
    lineHeight: 34,
  },
  rtl: {
    textAlign: 'right',
  },
});
