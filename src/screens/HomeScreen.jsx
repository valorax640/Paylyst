import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientHeader from '../components/GradientHeader';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { getTotalExpenses } from '../utils/calculations';
import { getCompactDisplay } from '../utils/formatNumber';

const { width } = Dimensions.get('window');

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
    },
    {
      label: 'Per Person',
      value: getCompactDisplay(avgExpensePerPerson).main,
      subtitle: getCompactDisplay(avgExpensePerPerson).sub,
      secondaryText: `${people.length} ${people.length === 1 ? 'person' : 'people'}`,
      icon: 'account-group',
      color: COLORS.secondary,
    },
    {
      label: 'Per Bill',
      value: getCompactDisplay(avgExpensePerBill).main,
      subtitle: getCompactDisplay(avgExpensePerBill).sub,
      secondaryText: `${expenses.length} ${expenses.length === 1 ? 'bill' : 'bills'}`,
      icon: 'receipt',
      color: COLORS.accent,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Header with Floating Stats */}
        <View style={styles.heroSection}>
          <GradientHeader
            title="Paylyst"
            subtitle="Split bills, track expenses"
            icon="wallet"
          />
          
          {/* Floating Main Stat Card */}
          <View style={styles.floatingMainCard}>
            <View style={styles.mainStatHeader}>
              <View style={styles.mainStatIconContainer}>
                <Icon name={stats[0].icon} size={28} color={COLORS.white} />
              </View>
              <View style={styles.mainStatTextContainer}>
                <Text style={styles.mainStatValue}>{stats[0].value}</Text>
                <Text style={styles.mainStatLabel}>{stats[0].label}</Text>
              </View>
            </View>
            {stats[0].subtitle && (
              <Text style={styles.mainStatSubtitle}>{stats[0].subtitle}</Text>
            )}
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.contentContainer}>
          <View style={styles.quickStatsGrid}>
            {stats.slice(1).map((stat, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.quickStatCard}
                activeOpacity={0.7}
              >
                <View>
                  <View style={styles.quickStatHeader}>
                    <View style={[styles.quickStatIcon, { backgroundColor: stat.color }]}>
                      <Icon name={stat.icon} size={16} color={COLORS.white} />
                    </View>
                    <View style={styles.quickStatDot} />
                  </View>
                  <Text style={styles.quickStatLabel}>{stat.label}</Text>
                  <Text style={styles.quickStatValue}>{stat.value}</Text>
                  {stat.subtitle && (
                    <Text style={styles.quickStatSubtitle}>{stat.subtitle}</Text>
                  )}
                </View>
                {stat.secondaryText && (
                  <Text style={[styles.quickStatSecondary, { backgroundColor: stat.color }]}>
                    {stat.secondaryText}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Activity with Modern Design */}
          {expenses.length > 0 && (
            <View style={styles.activitySection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Icon name="clock-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.sectionTitle}>Recent Activity</Text>
                </View>
                {/* <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <Icon name="chevron-right" size={16} color={COLORS.primary} />
                </TouchableOpacity> */}
              </View>
              
              <View style={styles.activityList}>
                {expenses.slice(-3).reverse().map((expense, index) => (
                  <TouchableOpacity
                    key={expense.id}
                    style={[styles.activityItem, index === 0 && styles.firstActivityItem]}
                    onPress={() => navigation.navigate('ExpenseDetails', { expense })}
                    activeOpacity={0.7}
                  >
                    <View style={styles.activityIconContainer}>
                      <View style={styles.activityIcon}>
                        <Icon name="receipt" size={16} color={COLORS.primary} />
                      </View>
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>{expense.name}</Text>
                      <Text style={styles.activitySubtitle}>
                        Paid by {expense.payer.name}
                      </Text>
                    </View>
                    <View style={styles.activityAmount}>
                      <Text style={styles.activityAmountText}>₹{expense.amount.toFixed(2)}</Text>
                      <Icon name="chevron-right" size={16} color={COLORS.textLight} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Getting Started with Better Design */}
          {people.length === 0 && (
            <View style={styles.onboardingCard}>
              <View style={styles.onboardingIconContainer}>
                <Icon name="account-group" size={48} color={COLORS.primary} />
              </View>
              <Text style={styles.onboardingTitle}>Welcome to Paylyst!</Text>
              <Text style={styles.onboardingText}>
                Start by adding people to your group, then split bills effortlessly
              </Text>
              <TouchableOpacity
                style={styles.onboardingButton}
                onPress={() => navigation.navigate('People')}
                activeOpacity={0.8}
              >
                <Icon name="plus" size={20} color={COLORS.white} />
                <Text style={styles.onboardingButtonText}>Add Your First Person</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    position: 'relative',
    paddingBottom: 40,
  },
  floatingMainCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 24,
    padding: 24,
    elevation: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  mainStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainStatIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  mainStatTextContainer: {
    flex: 1,
  },
  mainStatValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 36,
  },
  mainStatLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  mainStatSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.success + '20',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
    marginLeft: 4,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    minHeight: 120,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quickStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickStatDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
    lineHeight: 28,
  },
  quickStatLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  quickStatSubtitle: {
    fontSize: 9,
    color: COLORS.textLight,
    fontWeight: '500',
    marginBottom: 6,
  },
  quickStatSecondary: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  activitySection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  activityList: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  firstActivityItem: {
    backgroundColor: COLORS.primary + '05',
  },
  activityIconContainer: {
    marginRight: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  activityAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityAmountText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 8,
  },
  onboardingCard: {
    backgroundColor: COLORS.white,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary + '10',
  },
  onboardingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  onboardingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  onboardingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  onboardingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  onboardingButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default HomeScreen;