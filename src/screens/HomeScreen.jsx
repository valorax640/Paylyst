import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientHeader from '../components/GradientHeader';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { getTotalExpenses } from '../utils/calculations';
import { getCompactDisplay } from '../utils/formatNumber';

const HomeScreen = ({ navigation }) => {
  const { people, expenses } = useApp();
  const totalExpenses = getTotalExpenses(expenses);
  const totalExpenseDisplay = getCompactDisplay(totalExpenses);

  // Calculate additional stats
  const avgExpensePerPerson = people.length > 0 ? totalExpenses / people.length : 0;
  const avgExpensePerBill = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const stats = [
    {
      label: 'Total Spent',
      value: totalExpenseDisplay.main,
      subtitle: totalExpenseDisplay.sub,
      icon: 'wallet',
      color: COLORS.primary,
      trend: '+12%',
      trendColor: COLORS.success,
    },
    {
      label: 'Per Person',
      value: getCompactDisplay(avgExpensePerPerson).main,
      subtitle: `${people.length} people`,
      icon: 'account-group',
      color: COLORS.secondary,
    },
    {
      label: 'Per Bill',
      value: getCompactDisplay(avgExpensePerBill).main,
      subtitle: `${expenses.length} bills`,
      icon: 'receipt',
      color: COLORS.accent,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <GradientHeader
        title="Paylyst"
        subtitle="Split bills, track expenses"
        icon="wallet"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Enhanced Stats Section */}
        <View style={styles.heroStatsContainer}>
          <View style={styles.mainStatCard}>
            <Icon name={stats[0].icon} size={32} color={stats[0].color} />
            <Text style={styles.mainStatValue}>{stats[0].value}</Text>
            <Text style={styles.mainStatLabel}>{stats[0].label}</Text>
            {stats[0].subtitle && (
              <Text style={styles.mainStatSubtitle}>{stats[0].subtitle}</Text>
            )}
            {stats[0].trend && (
              <View style={styles.trendContainer}>
                <Icon name="trending-up" size={16} color={stats[0].trendColor} />
                <Text style={[styles.trendText, { color: stats[0].trendColor }]}>
                  {stats[0].trend} this month
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.subStatsContainer}>
            {stats.slice(1).map((stat, index) => (
              <View key={index} style={styles.subStatCard}>
                <View style={[styles.subStatIcon, { backgroundColor: stat.color + '20' }]}>
                  <Icon name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={styles.subStatValue}>{stat.value}</Text>
                <Text style={styles.subStatLabel}>{stat.label}</Text>
                {stat.subtitle && (
                  <Text style={styles.subStatSubtitle}>{stat.subtitle}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        {expenses.length > 0 && (
          <View style={styles. section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Expenses</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            {expenses.slice(-3).reverse().map((expense) => (
              <TouchableOpacity
                key={expense.id}
                style={styles.recentItem}
                onPress={() => navigation.navigate('ExpenseDetails', { expense })}
              >
                <View style={styles.recentIcon}>
                  <Icon name="receipt" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.recentText}>
                  <Text style={styles.recentTitle}>{expense.name}</Text>
                  <Text style={styles.recentSubtitle}>
                    Paid by {expense.payer.name}
                  </Text>
                </View>
                <Text style={styles.recentAmount}>₹{expense.amount.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Getting Started */}
        {people.length === 0 && (
          <View style={styles. gettingStarted}>
            <Icon name="information" size={60} color={COLORS.primary} />
            <Text style={styles.gettingStartedTitle}>Get Started</Text>
            <Text style={styles.gettingStartedText}>
              Add people to start splitting bills and tracking expenses
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('People')}
            >
              <Text style={styles.startButtonText}>Add People</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet. create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  heroStatsContainer: {
    marginBottom: 25,
  },
  mainStatCard: {
    backgroundColor: COLORS.card,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  mainStatValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  mainStatLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  mainStatSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  subStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subStatCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  subStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  subStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subStatLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  subStatSubtitle: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewAll: {
    fontSize: 14,
    color: COLORS. primary,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection:  'row',
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
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:  16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS. text,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize:  14,
    color:  COLORS.textSecondary,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    justifyContent:  'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentText: {
    flex: 1,
  },
  recentTitle:  {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  recentSubtitle: {
    fontSize: 13,
    color: COLORS. textSecondary,
    marginTop: 2,
  },
  recentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color:  COLORS.primary,
  },
  gettingStarted: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: COLORS. card,
    borderRadius: 20,
    marginTop: 20,
  },
  gettingStartedTitle:  {
    fontSize: 24,
    fontWeight: 'bold',
    color:  COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  gettingStartedText: {
    fontSize: 16,
    color: COLORS. textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical:  12,
    borderRadius: 12,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;