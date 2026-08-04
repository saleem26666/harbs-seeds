import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { updateHerbImage } from '../db/database';
import { resolveHerbImage } from '../services/onlineSearch';
import { colors } from '../theme/colors';

type Props = {
  herbId?: number;
  imageUrl?: string | null;
  imageQuery: string;
  nameEn?: string;
  scientificName?: string;
  style?: ViewStyle;
  fetchRemote?: boolean;
};

export function HerbImage({
  herbId,
  imageUrl,
  imageQuery,
  nameEn,
  scientificName,
  style,
  fetchRemote = true,
}: Props) {
  const [uri, setUri] = useState<string | null>(imageUrl ?? null);
  const triedKey = useRef<string>('');

  useEffect(() => {
    setUri(imageUrl ?? null);
    triedKey.current = '';
  }, [imageUrl, imageQuery, herbId]);

  useEffect(() => {
    if (!fetchRemote) return;
    if (uri) return;

    const key = `${herbId ?? ''}|${imageQuery}|${nameEn ?? ''}`;
    if (triedKey.current === key) return;
    triedKey.current = key;

    let alive = true;
    (async () => {
      try {
        const remote = await resolveHerbImage(imageQuery, null, {
          nameEn,
          scientificName,
        });
        if (!alive || !remote) return;
        setUri(remote);
        if (herbId) await updateHerbImage(herbId, remote);
      } catch {
        // Keep gradient fallback.
      }
    })();

    return () => {
      alive = false;
    };
  }, [uri, fetchRemote, imageQuery, herbId, nameEn, scientificName]);

  return (
    <View style={[styles.wrap, style]}>
      <LinearGradient
        colors={['#2F6B4F', '#1A3C2A', '#4C9A6E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {uri ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={400}
          cachePolicy="memory-disk"
          onError={() => {
            // Broken cached URL — clear and allow one retry with fresh lookup.
            triedKey.current = '';
            setUri(null);
            if (herbId) updateHerbImage(herbId, '').catch(() => undefined);
          }}
        />
      ) : null}
      <LinearGradient
        colors={['transparent', 'rgba(26,60,42,0.35)']}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: colors.leaf,
  },
});
