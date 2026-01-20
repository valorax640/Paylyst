import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';

const CustomButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  icon, 
  disabled = false,
  loading = false,
  style 
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return COLORS.secondary;
      case 'accent':
        return COLORS.accent;
      default:
        return COLORS.primary;
    }
  };

  if (disabled) {
    return (
      <TouchableOpacity style={[styles.button, styles.disabled, style]} disabled>
        <Text style={styles.disabledText}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={loading} style={[styles.button, { backgroundColor: getBackgroundColor() }, style]}>
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <>
          {icon && <Icon name={icon} size={20} color={COLORS.white} style={styles.icon} />}
          <Text style={styles.text}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  disabled: {
    backgroundColor: COLORS.textLight,
    elevation: 0,
  },
  text: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 8,
  },
});

export default CustomButton;