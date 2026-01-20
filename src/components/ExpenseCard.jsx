import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';

const ExpenseCard = ({ expense, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{expense.name}</Text>
        <Text style={styles. amount}>${expense.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.detail}>
          <Icon name="account" size={14} color={COLORS.textSecondary} />
          {' '}Paid by:  <Text style={styles.payer}>{expense.payer. name}</Text>
        </Text>
        <View style={styles.badge}>
          <Icon 
            name={expense.splitMode === 'equal' ? 'equal' : 'chart-pie'} 
            size={12} 
            color={COLORS.white} 
          />
          <Text style={styles.badgeText}>
            {expense.splitMode === 'equal' ? 'Equal' : 'Custom'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name:  {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS. text,
    flex: 1,
  },
  amount: {
    fontSize:  20,
    fontWeight:  'bold',
    color:  COLORS.primary,
  },
  details:  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detail: {
    fontSize: 14,
    color: COLORS. textSecondary,
  },
  payer: {
    fontWeight: '600',
    color: COLORS.text,
  },
  badge:  {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical:  4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    color:  COLORS.white,
    fontSize: 12,
    fontWeight:  '600',
  },
});

export default ExpenseCard;