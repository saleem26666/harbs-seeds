import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  autoFocus?: boolean;
};

export function SearchBar({ value, onChangeText, autoFocus }: Props) {
  const { t, language, isRtl } = useApp();

  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t.searchPlaceholder}
        placeholderTextColor={colors.mute}
        autoFocus={autoFocus}
        autoCorrect={false}
        style={[
          styles.input,
          language === 'ur' && styles.urdu,
          isRtl && styles.rtl,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.cream,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: colors.forest,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: 12,
  },
  urdu: {
    fontFamily: fonts.urdu,
    fontSize: 18,
    lineHeight: 32,
  },
  rtl: {
    textAlign: 'right',
  },
});
