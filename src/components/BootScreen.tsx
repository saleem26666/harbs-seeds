import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export function BootScreen() {
  const { t, seedProgress, error, retryInit, language } = useApp();
  const pulse = useRef(new Animated.Value(0.7)).current;
  const bar = useRef(new Animated.Value(0)).current;

  const percent =
    seedProgress && seedProgress.total > 0
      ? Math.round((seedProgress.current / seedProgress.total) * 100)
      : 0;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.7, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);

  useEffect(() => {
    Animated.timing(bar, {
      toValue: percent / 100,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [percent, bar]);

  const width = bar.interpolate({
    inputRange: [0, 1],
    outputRange: ['4%', '100%'],
  });

  return (
    <LinearGradient colors={['#1A3C2A', '#244C35', '#2F6B4F']} style={styles.root}>
      <Animated.View style={[styles.orb, { opacity: pulse, transform: [{ scale: pulse }] }]} />
      <Text style={styles.brand}>{t.appName}</Text>
      <Text style={[styles.tag, language === 'ur' && styles.urdu]}>{t.tagline}</Text>

      {error ? (
        <View style={styles.box}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={retryInit} style={styles.retry}>
            <Text style={styles.retryText}>{t.retry}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.box}>
          <Text style={[styles.status, language === 'ur' && styles.urdu]}>{t.seeding}</Text>
          <Text style={[styles.hint, language === 'ur' && styles.urdu]}>{t.seedingHint}</Text>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width }]} />
          </View>
          <Text style={styles.percent}>{percent}%</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  orb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(183,228,199,0.25)',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.cream,
    textAlign: 'center',
  },
  tag: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.mint,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 36,
    maxWidth: 300,
    lineHeight: 22,
  },
  urdu: {
    fontFamily: fonts.urdu,
    lineHeight: 34,
  },
  box: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'rgba(255,253,248,0.1)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  status: {
    fontFamily: fonts.bodyMedium,
    color: colors.cream,
    fontSize: 15,
    marginBottom: 6,
  },
  hint: {
    fontFamily: fonts.body,
    color: colors.mint,
    fontSize: 13,
    marginBottom: 18,
  },
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.25)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.mint,
  },
  percent: {
    marginTop: 10,
    fontFamily: fonts.bodyBold,
    color: colors.cream,
    fontSize: 13,
  },
  error: {
    fontFamily: fonts.body,
    color: colors.cream,
    marginBottom: 12,
  },
  retry: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cream,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  retryText: {
    fontFamily: fonts.bodyBold,
    color: colors.forest,
  },
});
