import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export function LanguageToggle() {
  const { language, setLanguage, t } = useApp();

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => setLanguage('en')}
        style={[styles.btn, language === 'en' && styles.active]}
      >
        <Text style={[styles.text, language === 'en' && styles.activeText]}>
          {t.english}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setLanguage('ur')}
        style={[styles.btn, language === 'ur' && styles.active]}
      >
        <Text style={[styles.text, language === 'ur' && styles.activeText, styles.urdu]}>
          {t.urdu}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  active: {
    backgroundColor: colors.cream,
  },
  text: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.mint,
  },
  activeText: {
    color: colors.forest,
  },
  urdu: {
    fontFamily: fonts.urdu,
    fontSize: 15,
    lineHeight: 22,
  },
});
