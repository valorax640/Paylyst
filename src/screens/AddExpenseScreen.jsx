import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientHeader from '../components/GradientHeader';
import CustomButton from '../components/CustomButton';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { calculateEqualSplit } from '../utils/calculations';

const AddExpenseScreen = ({ navigation }) => {
  const { people, addExpense } = useApp();
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [selectedPayer, setSelectedPayer] = useState(null);
  const [splitMode, setSplitMode] = useState('equal');
  const [customSplits, setCustomSplits] = useState({});

  const handleAddExpense = () => {
    if (!expenseName.trim()) {
      Alert.alert('Error', 'Please enter expense name');
      return;
    }
    if (!expenseAmount || parseFloat(expenseAmount) <= 0) {
      Alert.alert('Error', 'Please enter valid amount');
      return;
    }
    if (! selectedPayer) {
      Alert.alert('Error', 'Please select who paid');
      return;
    }

    const amount = parseFloat(expenseAmount);
    const splits = splitMode === 'equal' 
      ? calculateEqualSplit(amount, people)
      : customSplits;

    // Validate custom splits
    if (splitMode === 'custom') {
      const totalSplit = Object.values(splits).reduce((sum, val) => sum + val, 0);
      if (Math.abs(totalSplit - amount) > 0.01) {
        Alert.alert('Error', `Custom splits (${totalSplit. toFixed(2)}) must equal the total amount (${amount.toFixed(2)})`);
        return;
      }
    }

    addExpense({
      name: expenseName,
      amount: amount,
      payer:  selectedPayer,
      splits:  splits,
      splitMode: splitMode,
    });

    Alert.alert('Success', 'Expense added successfully', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const updateCustomSplit = (personId, value) => {
    setCustomSplits({
      ...customSplits,
      [personId]: parseFloat(value) || 0,
    });
  };

  const getTotalCustomSplit = () => {
    return Object.values(customSplits).reduce((sum, val) => sum + val, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <GradientHeader 
        title="Add Expense" 
        subtitle="Split a new bill"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Expense Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Expense Details</Text>
          
          <Text style={styles.label}>Expense Name</Text>
          <View style={styles.inputContainer}>
            <Icon name="receipt" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles. input}
              placeholder="e.g., Dinner, Movie tickets"
              placeholderTextColor={COLORS. textSecondary}
              value={expenseName}
              onChangeText={setExpenseName}
            />
          </View>

          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputContainer}>
            <Icon name="currency-inr" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={COLORS.textSecondary}
              value={expenseAmount}
              onChangeText={setExpenseAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Payer Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Who Paid? </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.payerScroll}>
            {people.map((person) => (
              <TouchableOpacity
                key={person.id}
                style={[
                  styles.payerOption,
                  selectedPayer?. id === person.id && styles. payerOptionSelected,
                ]}
                onPress={() => setSelectedPayer(person)}
              >
                <View style={[
                  styles.payerAvatar,
                  selectedPayer?.id === person.id && styles.payerAvatarSelected,
                ]}>
                  <Text style={[
                    styles.payerAvatarText,
                    selectedPayer?.id === person.id && styles.payerAvatarTextSelected,
                  ]}>
                    {person.name. charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={[
                  styles.payerName,
                  selectedPayer?. id === person.id && styles. payerNameSelected,
                ]}>
                  {person.name}
                </Text>
                {selectedPayer?.id === person. id && (
                  <Icon name="check-circle" size={20} color={COLORS.primary} style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Split Mode */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Split Method</Text>
          <View style={styles.splitModeContainer}>
            <TouchableOpacity
              style={[
                styles.splitModeButton,
                splitMode === 'equal' && styles.splitModeButtonActive,
              ]}
              onPress={() => setSplitMode('equal')}
            >
              <Icon 
                name="equal" 
                size={24} 
                color={splitMode === 'equal' ?  COLORS.white : COLORS.primary} 
              />
              <Text style={[
                styles.splitModeText,
                splitMode === 'equal' && styles.splitModeTextActive,
              ]}>
                Equal Split
              </Text>
              <Text style={[
                styles.splitModeSubtext,
                splitMode === 'equal' && styles.splitModeSubtextActive,
              ]}>
                Divide equally
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.splitModeButton,
                splitMode === 'custom' && styles. splitModeButtonActive,
              ]}
              onPress={() => setSplitMode('custom')}
            >
              <Icon 
                name="chart-pie" 
                size={24} 
                color={splitMode === 'custom' ? COLORS. white : COLORS.primary} 
              />
              <Text style={[
                styles.splitModeText,
                splitMode === 'custom' && styles.splitModeTextActive,
              ]}>
                Custom Split
              </Text>
              <Text style={[
                styles. splitModeSubtext,
                splitMode === 'custom' && styles.splitModeSubtextActive,
              ]}>
                Custom amounts
              </Text>
            </TouchableOpacity>
          </View>

          {/* Preview */}
          {splitMode === 'equal' && expenseAmount && (
            <View style={styles.preview}>
              <Icon name="information" size={20} color={COLORS.info} />
              <Text style={styles.previewText}>
                Each person pays ${(parseFloat(expenseAmount) / people.length).toFixed(2)}
              </Text>
            </View>
          )}

          {/* Custom Splits */}
          {splitMode === 'custom' && (
            <View style={styles. customSplitsContainer}>
              <Text style={styles.customSplitsTitle}>Enter amount for each person: </Text>
              {people.map((person) => (
                <View key={person.id} style={styles.customSplitRow}>
                  <View style={styles.customSplitPerson}>
                    <View style={styles.miniAvatar}>
                      <Text style={styles.miniAvatarText}>
                        {person.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.customSplitName}>{person.name}</Text>
                  </View>
                  <View style={styles.customSplitInputContainer}>
                    <Text style={styles.dollarSign}>₹</Text>
                    <TextInput
                      style={styles.customSplitInput}
                      placeholder="0.00"
                      placeholderTextColor={COLORS.textSecondary}
                      value={customSplits[person.id]?.toString() || ''}
                      onChangeText={(text) => updateCustomSplit(person.id, text)}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
              ))}
              <View style={styles.customSplitTotal}>
                <Text style={styles.customSplitTotalLabel}>Total:</Text>
                <Text style={[
                  styles.customSplitTotalValue,
                  getTotalCustomSplit() === parseFloat(expenseAmount) && styles.customSplitTotalCorrect,
                ]}>
                  ₹{getTotalCustomSplit().toFixed(2)} / ₹{parseFloat(expenseAmount || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        </View>

        <CustomButton
          title="Add Expense"
          onPress={handleAddExpense}
          icon="check"
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor:  COLORS.card,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity:  0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color:  COLORS.text,
    marginBottom: 16,
  },
  label:  {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal:  16,
    marginBottom:  16,
    borderWidth:  1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS. text,
    paddingVertical: 14,
    marginLeft: 12,
  },
  payerScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  payerOption: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    minWidth: 100,
  },
  payerOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  payerAvatar: {
    width:  50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.textLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  payerAvatarSelected:  {
    backgroundColor: COLORS.primary,
  },
  payerAvatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  payerAvatarTextSelected: {
    color: COLORS.white,
  },
  payerName: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  payerNameSelected: {
    color: COLORS.primary,
  },
  checkIcon: {
    marginTop: 4,
  },
  splitModeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  splitModeButton:  {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  splitModeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  splitModeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 8,
  },
  splitModeTextActive: {
    color: COLORS.white,
  },
  splitModeSubtext: {
    fontSize: 12,
    color: COLORS. textSecondary,
    marginTop: 4,
  },
  splitModeSubtextActive: {
    color:  COLORS.white,
    opacity: 0.8,
  },
  preview: {
    flexDirection: 'row',
    alignItems:  'center',
    backgroundColor: COLORS.info + '15',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  previewText: {
    fontSize: 14,
    color: COLORS. info,
    marginLeft: 8,
    fontWeight: '600',
  },
  customSplitsContainer:  {
    marginTop: 16,
  },
  customSplitsTitle:  {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS. textSecondary,
    marginBottom: 12,
  },
  customSplitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS. border,
  },
  customSplitPerson: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  miniAvatarText: {
    color:  COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  customSplitName: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  customSplitInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dollarSign:  {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  customSplitInput:  {
    fontSize: 16,
    color:  COLORS.text,
    paddingVertical: 8,
    width: 80,
    textAlign: 'right',
  },
  customSplitTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  customSplitTotalLabel: {
    fontSize:  16,
    fontWeight: 'bold',
    color:  COLORS.text,
  },
  customSplitTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color:  COLORS.danger,
  },
  customSplitTotalCorrect: {
    color: COLORS.success,
  },
  submitButton: {
    marginBottom: 20,
  },
});

export default AddExpenseScreen;