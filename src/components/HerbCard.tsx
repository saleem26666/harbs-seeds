import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { HerbSummary } from '../db/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { HerbImage } from './HerbImage';

type Props = {
  herb: HerbSummary;
  onPress: () => void;
};

export function HerbCard({ herb, onPress }: Props) {
  const { language, t, isRtl } = useApp();
  const name = language === 'ur' ? herb.name_ur : herb.name_en;
  const category = t.categories[herb.category] ?? herb.category;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <HerbImage
        herbId={herb.id}
        imageUrl={herb.image_url}
        imageQuery={herb.image_query}
        nameEn={herb.name_en}
        scientificName={herb.scientific_name}
        style={styles.image}
        fetchRemote
      />
      <View style={[styles.body, isRtl && styles.rtl]}>
        <Text style={[styles.name, language === 'ur' && styles.urdu]} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.sci} numberOfLines={1}>
          {herb.scientific_name}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.chip}>{category}</Text>
          {herb.source === 'online' ? (
            <Text style={styles.online}>ONLINE</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    padding: 12,
    borderRadius: 22,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 18,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  rtl: {
    alignItems: 'flex-end',
  },
  name: {
    fontFamily: fonts.displaySoft,
    fontSize: 18,
    color: colors.ink,
  },
  urdu: {
    fontFamily: fonts.urdu,
    fontSize: 20,
    lineHeight: 34,
    textAlign: 'right',
  },
  sci: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.mute,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.leaf,
    backgroundColor: colors.mist,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  online: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 0.6,
  },
});
