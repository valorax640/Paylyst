import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

const GradientHeader = ({ title, subtitle }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.header, {paddingTop: insets.top + 20}]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    padding: 30,
    paddingTop: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.white,
    marginTop: 5,
    opacity: 0.9,
  },
});

export default GradientHeader;