import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LanguageToggle } from '../components/LanguageToggle';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export function SettingsScreen() {
  const { t, language, herbCount, isRtl } = useApp();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Text style={[styles.title, language === 'ur' && styles.urdu, isRtl && styles.rtl]}>
        {t.settings}
      </Text>

      <View style={styles.card}>
        <Text style={[styles.label, language === 'ur' && styles.urdu]}>{t.language}</Text>
        <View style={styles.toggleWrap}>
          <LanguageToggle />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={[styles.label, language === 'ur' && styles.urdu]}>{t.offlineReady}</Text>
        <Text style={styles.value}>{herbCount.toLocaleString()}</Text>
        <Text style={[styles.hint, language === 'ur' && styles.urdu]}>{t.totalEntries}</Text>
      </View>

      <Text style={[styles.disclaimer, language === 'ur' && styles.urdu, isRtl && styles.rtl]}>
        {t.disclaimer}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.sand,
    padding: 20,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.forest,
    marginBottom: 18,
  },
  card: {
    backgroundColor: colors.cream,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 14,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    color: colors.mute,
    marginBottom: 12,
  },
  toggleWrap: {
    alignSelf: 'flex-start',
    backgroundColor: colors.forest,
    borderRadius: 999,
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.forest,
  },
  hint: {
    fontFamily: fonts.body,
    color: colors.mute,
    marginTop: 4,
  },
  disclaimer: {
    fontFamily: fonts.body,
    color: colors.mute,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  urdu: {
    fontFamily: fonts.urdu,
    lineHeight: 32,
  },
  rtl: {
    textAlign: 'right',
  },
});
