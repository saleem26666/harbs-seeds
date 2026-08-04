import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HerbImage } from '../components/HerbImage';
import { useApp } from '../context/AppContext';
import { getHerbById, toggleFavorite } from '../db/database';
import { getFluentUrduDetail } from '../db/urduDetails';
import { Herb } from '../db/types';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export function DetailScreen({ route }: Props) {
  const { t, language, isRtl } = useApp();
  const [herb, setHerb] = useState<Herb | null>(null);
  const [tab, setTab] = useState<'benefits' | 'harms' | 'usage'>('benefits');
  const [showUrduDetail, setShowUrduDetail] = useState(false);

  useEffect(() => {
    setShowUrduDetail(false);
    getHerbById(route.params.id).then(setHerb).catch(() => undefined);
  }, [route.params.id]);

  if (!herb) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.leaf} size="large" />
      </View>
    );
  }

  const name = language === 'ur' ? herb.name_ur : herb.name_en;
  const secondary = language === 'ur' ? herb.name_en : herb.name_ur;
  const body =
    tab === 'benefits'
      ? language === 'ur'
        ? herb.benefits_ur
        : herb.benefits_en
      : tab === 'harms'
        ? language === 'ur'
          ? herb.harms_ur
          : herb.harms_en
        : language === 'ur'
          ? herb.usage_ur
          : herb.usage_en;

  const onFavorite = async () => {
    const next = await toggleFavorite(herb.id);
    setHerb({ ...herb, is_favorite: next });
  };

  const toggleUrduDetail = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowUrduDetail((v) => !v);
  };

  return (
    <View style={styles.root}>
      <HerbImage
        herbId={herb.id}
        imageUrl={herb.image_url}
        imageQuery={herb.image_query}
        nameEn={herb.name_en}
        scientificName={herb.scientific_name}
        style={styles.heroImage}
        fetchRemote
      />
      <SafeAreaView edges={['top']} style={styles.topBar}>
        <Pressable onPress={onFavorite} style={styles.favBtn}>
          <Text style={styles.favText}>{herb.is_favorite ? '♥' : '♡'}</Text>
        </Pressable>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.titleBlock, isRtl && styles.rtlBlock]}>
          <Text style={[styles.title, language === 'ur' && styles.urduTitle]}>{name}</Text>
          <Text style={[styles.secondary, language !== 'ur' && styles.urduSecondary]}>
            {secondary}
          </Text>
          <Text style={styles.sci}>{herb.scientific_name}</Text>
          <View style={styles.chips}>
            <Text style={styles.chip}>{t.categories[herb.category] ?? herb.category}</Text>
            <Text style={styles.chipMuted}>
              {herb.source === 'online' ? t.sourceOnline : t.sourceLocal}
            </Text>
          </View>
        </View>

        <View style={styles.tabs}>
          {(['benefits', 'harms', 'usage'] as const).map((key) => (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              style={[styles.tab, tab === key && styles.tabActive]}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === key && styles.tabTextActive,
                  language === 'ur' && styles.urduTab,
                ]}
              >
                {key === 'benefits' ? t.benefits : key === 'harms' ? t.harms : t.usage}
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={[
            styles.panel,
            tab === 'harms' && styles.panelDanger,
            isRtl && styles.rtlBlock,
          ]}
        >
          <Text
            style={[
              styles.panelText,
              language === 'ur' && styles.urduBody,
              tab === 'harms' && styles.dangerText,
            ]}
          >
            {body}
          </Text>
        </View>

        <Pressable onPress={toggleUrduDetail} style={styles.moreBtn}>
          <Text style={styles.moreBtnText}>
            {showUrduDetail ? t.hideDetailUrdu : t.moreDetailUrdu}
          </Text>
        </Pressable>

        {showUrduDetail ? (
          <View style={styles.urduDetailPanel}>
            <Text style={styles.urduDetailHeading}>{t.moreDetailTitle}</Text>
            <Text style={styles.urduDetailBody}>{getFluentUrduDetail(herb)}</Text>
          </View>
        ) : null}

        <Text style={[styles.disclaimer, language === 'ur' && styles.urduBody, isRtl && styles.rtl]}>
          {t.disclaimer}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.sand,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sand,
  },
  heroImage: {
    height: 300,
    width: '100%',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    right: 16,
  },
  favBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,253,248,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favText: {
    fontSize: 22,
    color: colors.danger,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
    marginTop: -28,
    backgroundColor: colors.sand,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  titleBlock: {
    marginBottom: 18,
  },
  rtlBlock: {
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 34,
    color: colors.forest,
  },
  urduTitle: {
    fontFamily: fonts.urduBold,
    fontSize: 32,
    lineHeight: 52,
    textAlign: 'right',
  },
  secondary: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.mute,
    marginTop: 4,
  },
  urduSecondary: {
    fontFamily: fonts.urdu,
    fontSize: 18,
    lineHeight: 32,
  },
  sci: {
    fontFamily: fonts.body,
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.mute,
    marginTop: 6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.forest,
    backgroundColor: colors.mist,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  chipMuted: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.mute,
    backgroundColor: colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    backgroundColor: colors.cream,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tabActive: {
    backgroundColor: colors.forest,
    borderColor: colors.forest,
  },
  tabText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.mute,
    textAlign: 'center',
  },
  tabTextActive: {
    color: colors.cream,
  },
  urduTab: {
    fontFamily: fonts.urdu,
    fontSize: 13,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: colors.cream,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
  },
  panelDanger: {
    backgroundColor: colors.dangerSoft,
    borderColor: '#E8C7C1',
  },
  panelText: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 26,
    color: colors.ink,
  },
  urduBody: {
    fontFamily: fonts.urdu,
    fontSize: 18,
    lineHeight: 36,
    textAlign: 'right',
  },
  dangerText: {
    color: colors.danger,
  },
  moreBtn: {
    marginTop: 16,
    backgroundColor: colors.forest,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  moreBtnText: {
    fontFamily: fonts.urdu,
    fontSize: 18,
    lineHeight: 32,
    color: colors.cream,
  },
  urduDetailPanel: {
    marginTop: 14,
    backgroundColor: colors.mist,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
  },
  urduDetailHeading: {
    fontFamily: fonts.urduBold,
    fontSize: 20,
    lineHeight: 36,
    color: colors.forest,
    textAlign: 'right',
    marginBottom: 10,
  },
  urduDetailBody: {
    fontFamily: fonts.urdu,
    fontSize: 18,
    lineHeight: 38,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  disclaimer: {
    marginTop: 18,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.mute,
    lineHeight: 18,
  },
  rtl: {
    textAlign: 'right',
  },
});
