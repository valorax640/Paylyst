import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';

const PersonCard = ({ person, balance, onPress, onDelete, showBalance = true }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {person.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{person.name}</Text>
          {showBalance && balance !== undefined && (
            <Text style={[
              styles.balance,
              balance > 0 ? styles.positive : styles.negative
            ]}>
              {balance > 0 ? '+' : ''}₹{balance.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
      {onDelete && (
        <TouchableOpacity onPress={onDelete}>
          <Icon name="close-circle" size={24} color={COLORS.danger} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS. black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity:  0.1,
    shadowRadius: 3,
  },
  content:  {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width:  50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems:  'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  details: {
    flex: 1,
  },
  name:  {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  balance:  {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  positive: {
    color: COLORS.success,
  },
  negative: {
    color: COLORS.danger,
  },
});

export default PersonCard;