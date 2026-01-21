import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientHeader from '../components/GradientHeader';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { calculateBalances, calculateSettlements, getTotalExpenses } from '../utils/calculations';

const SettlementScreen = ({ navigation }) => {
  const { people, expenses } = useApp();
  const balances = calculateBalances(people, expenses);
  const settlements = calculateSettlements(balances, people);
  const totalExpenses = getTotalExpenses(expenses);

  // Redirect if no people or expenses exist - only when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (people.length === 0) {
        Alert.alert(
          'No People Added',
          'Please add people first to see settlements.',
          [{ text: 'OK', onPress: () => navigation.navigate('People') }]
        );
        return;
      } 
      
      if (expenses.length === 0) {
        Alert.alert(
          'No Bills Added',
          'Please add some bills first to see settlements.',
          [{ text: 'OK', onPress: () => navigation.navigate('AddExpense') }]
        );
        return;
      }
    }, [people.length, expenses.length, navigation])
  );

  // Don't render the screen if no people or expenses
  if (people.length === 0 || expenses.length === 0) {
    return null;
  }

  const positiveBalances = people.filter(p => balances[p.id] > 0.01);
  const negativeBalances = people.filter(p => balances[p.id] < -0.01);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <GradientHeader 
        title="Settlements" 
        subtitle="Who owes whom"
      />

      <ScrollView style={styles. content} showsVerticalScrollIndicator={false}>
        {/* Total Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewGradient}>
            <Icon name="chart-pie" size={40} color={COLORS.white} />
            <Text style={styles.overviewAmount}>₹{totalExpenses.toFixed(2)}</Text>
            <Text style={styles.overviewLabel}>Total Expenses</Text>
            <View style={styles.overviewStats}>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>{expenses.length}</Text>
                <Text style={styles.overviewStatLabel}>Bills</Text>
              </View>
              <View style={styles.overviewDivider} />
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>{people.length}</Text>
                <Text style={styles.overviewStatLabel}>People</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settlements - How to Settle */}
        {settlements.length > 0 ?  (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="swap-horizontal" size={24} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>How to Settle Up</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Make these {settlements.length} payment{settlements.length > 1 ? 's' :  ''} to settle all expenses
            </Text>
            
            {settlements.map((settlement, index) => (
              <View key={index} style={styles. settlementRow}>
                <View style={styles.settlementFrom}>
                  <View style={styles.settlementAvatar}>
                    <Text style={styles.settlementAvatarText}>
                      {settlement.from.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.settlementName}>{settlement.from.name}</Text>
                </View>
                
                <View style={styles.settlementArrow}>
                  <View style={styles.settlementAmountBadge}>
                    <Text style={styles.settlementAmount}>
                      ₹{settlement.amount.toFixed(2)}
                    </Text>
                  </View>
                  <Icon name="arrow-right" size={24} color={COLORS.primary} />
                </View>
                
                <View style={styles.settlementTo}>
                  <View style={[styles.settlementAvatar, styles.settlementAvatarTo]}>
                    <Text style={styles.settlementAvatarText}>
                      {settlement. to.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.settlementName}>{settlement. to.name}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.allSettled}>
              <Icon name="check-circle" size={80} color={COLORS.success} />
              <Text style={styles.allSettledTitle}>All Settled!</Text>
              <Text style={styles.allSettledText}>
                Everyone has paid their fair share
              </Text>
            </View>
          </View>
        )}

        {/* Individual Balances */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Icon name="account-cash" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Individual Balances</Text>
          </View>

          {/* People who should receive money */}
          {positiveBalances.length > 0 && (
            <View style={styles.balanceSection}>
              <View style={styles.balanceSectionHeader}>
                <Icon name="arrow-down-circle" size={20} color={COLORS.success} />
                <Text style={styles.balanceSectionTitle}>Should Receive</Text>
              </View>
              {positiveBalances.map((person) => (
                <View key={person. id} style={styles.balanceRow}>
                  <View style={styles.balancePerson}>
                    <View style={[styles.balanceAvatar, { backgroundColor: COLORS.success }]}>
                      <Text style={styles.balanceAvatarText}>
                        {person.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.balanceName}>{person.name}</Text>
                  </View>
                  <Text style={[styles.balanceAmount, styles.positiveBalance]}>
                    +₹{balances[person.id].toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* People who owe money */}
          {negativeBalances.length > 0 && (
            <View style={styles.balanceSection}>
              <View style={styles.balanceSectionHeader}>
                <Icon name="arrow-up-circle" size={20} color={COLORS.danger} />
                <Text style={styles.balanceSectionTitle}>Should Pay</Text>
              </View>
              {negativeBalances. map((person) => (
                <View key={person.id} style={styles.balanceRow}>
                  <View style={styles.balancePerson}>
                    <View style={[styles. balanceAvatar, { backgroundColor:  COLORS.danger }]}>
                      <Text style={styles. balanceAvatarText}>
                        {person.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.balanceName}>{person.name}</Text>
                  </View>
                  <Text style={[styles.balanceAmount, styles.negativeBalance]}>
                    -₹{Math.abs(balances[person.id]).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* All settled */}
          {positiveBalances.length === 0 && negativeBalances.length === 0 && (
            <View style={styles.emptyBalances}>
              <Icon name="equal" size={40} color={COLORS.textLight} />
              <Text style={styles.emptyBalancesText}>Everyone is settled up!</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddExpense')}
          >
            <View style={[styles.actionButtonGradient, { backgroundColor: COLORS.secondary }]}>
              <Icon name="plus-circle" size={24} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Add New Expense</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('People')}
          >
            <View style={[styles.actionButtonGradient, { backgroundColor: COLORS.accent }]}>
              <Icon name="account-multiple" size={24} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Manage People</Text>
            </View>
          </TouchableOpacity>
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
  content:  {
    flex: 1,
    padding: 20,
  },
  overviewCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity:  0.3,
    shadowRadius: 6,
  },
  overviewGradient: {
    backgroundColor: COLORS.primary,
    padding: 30,
    alignItems: 'center',
  },
  overviewAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 12,
  },
  overviewLabel: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  overviewStats: {
    flexDirection:  'row',
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
  },
  overviewStat: {
    flex: 1,
    alignItems: 'center',
  },
  overviewDivider: {
    width: 1,
    backgroundColor: COLORS.white,
    opacity: 0.3,
  },
  overviewStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color:  COLORS.white,
  },
  overviewStatLabel: {
    fontSize: 13,
    color: COLORS. white,
    opacity: 0.9,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity:  0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection:  'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  settlementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  settlementFrom: {
    flex: 1,
    alignItems: 'center',
  },
  settlementTo: {
    flex: 1,
    alignItems: 'center',
  },
  settlementAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems:  'center',
    marginBottom: 6,
  },
  settlementAvatarTo: {
    backgroundColor: COLORS.success,
  },
  settlementAvatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  settlementName: {
    fontSize:  14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  settlementArrow: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  settlementAmountBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical:  6,
    borderRadius:  12,
    marginBottom: 8,
  },
  settlementAmount: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  allSettled: {
    alignItems: 'center',
    padding: 40,
  },
  allSettledTitle:  {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS. success,
    marginTop: 16,
  },
  allSettledText: {
    fontSize:  16,
    color:  COLORS.textSecondary,
    marginTop: 8,
  },
  balanceSection: {
    marginBottom: 20,
  },
  balanceSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor:  COLORS.border,
  },
  balanceSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  balancePerson:  {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  balanceAvatar: {
    width: 40,
    height:  40,
    borderRadius:  20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  balanceAvatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS. text,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  positiveBalance: {
    color:  COLORS.success,
  },
  negativeBalance: {
    color: COLORS.danger,
  },
  emptyBalances: {
    alignItems: 'center',
    padding: 30,
  },
  emptyBalancesText: {
    fontSize: 16,
    color: COLORS. textSecondary,
    marginTop: 12,
  },
  actionsCard: {
    marginBottom:  20,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity:  0.2,
    shadowRadius: 4,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  actionButtonText: {
    color:  COLORS.white,
    fontSize: 16,
    fontWeight:  'bold',
  },
});

export default SettlementScreen;