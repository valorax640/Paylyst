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
import PersonCard from '../components/PersonCard';
import CustomButton from '../components/CustomButton';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { calculateBalances } from '../utils/calculations';

const PeopleScreen = ({ navigation }) => {
  const { people, expenses, addPerson, removePerson } = useApp();
  const [name, setName] = useState('');
  const balances = calculateBalances(people, expenses);

  const handleAddPerson = () => {
    if (name.trim()) {
      addPerson(name);
      setName('');
    }
  };

  const handleRemovePerson = (person) => {
    Alert.alert(
      'Remove Person',
      `Are you sure you want to remove ${person.name}?  This will also remove their expenses.`,
      [
        { text: 'Cancel', style:  'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removePerson(person. id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS. primary} />
      
      <GradientHeader 
        title="People" 
        subtitle={`${people.length} people in group`}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Person Section */}
        <View style={styles.addSection}>
          <Text style={styles.label}>Add New Person</Text>
          <View style={styles.inputContainer}>
            <Icon name="account-plus" size={24} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              placeholderTextColor={COLORS. textSecondary}
              value={name}
              onChangeText={setName}
              onSubmitEditing={handleAddPerson}
              returnKeyType="done"
            />
            {name.trim().length > 0 && (
              <TouchableOpacity onPress={() => setName('')}>
                <Icon name="close-circle" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            )}
          </View>
          <CustomButton
            title="Add Person"
            onPress={handleAddPerson}
            icon="plus"
            disabled={! name.trim()}
          />
        </View>

        {/* People List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            All People ({people.length})
          </Text>
          
          {people.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="account-multiple-plus" size={80} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No people added yet</Text>
              <Text style={styles.emptySubtext}>
                Add people above to start splitting bills
              </Text>
            </View>
          ) : (
            people.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                balance={balances[person.id]}
                onDelete={() => handleRemovePerson(person)}
              />
            ))
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
  content: {
    flex: 1,
    padding: 20,
  },
  addSection: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height:  2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label:  {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems:  'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  inputIcon: {
    marginRight:  8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color:  COLORS.text,
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyText:  {
    fontSize: 18,
    color: COLORS. textSecondary,
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default PeopleScreen;