import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const STORAGE_KEYS = {
  PEOPLE: '@paylyst_people',
  EXPENSES: '@paylyst_expenses',
};

export const AppProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever people or expenses change
  useEffect(() => {
    const saveData = async () => {
      try {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(people)),
          AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses)),
        ]);
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
    };

    if (!isLoading) {
      saveData();
    }
  }, [people, expenses, isLoading]);

  const loadData = async () => {
    try {
      const [storedPeople, storedExpenses] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PEOPLE),
        AsyncStorage.getItem(STORAGE_KEYS.EXPENSES),
      ]);

      if (storedPeople) {
        setPeople(JSON.parse(storedPeople));
      }
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      }
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPerson = (name) => {
    const newPerson = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedPeople = [...people, newPerson];
    setPeople(updatedPeople);
    
    // Redistribute existing expenses to include the new person
    const updatedExpenses = expenses.map(expense => {
      const totalAmount = expense.amount;
      const newSplitAmount = totalAmount / updatedPeople.length;
      const newSplits = {};
      
      updatedPeople.forEach(person => {
        newSplits[person.id] = newSplitAmount;
      });
      
      return {
        ...expense,
        splits: newSplits
      };
    });
    
    setExpenses(updatedExpenses);
    return newPerson;
  };

  const removePerson = (id) => {
    const remainingPeople = people.filter(person => person.id !== id);
    setPeople(remainingPeople);
    
    if (remainingPeople.length === 0) {
      // If no people left, clear all expenses
      setExpenses([]);
      return;
    }
    
    // Remove expenses where the removed person was the payer
    const validExpenses = expenses.filter(expense => expense.payer.id !== id);
    
    // Redistribute remaining expenses among remaining people
    const updatedExpenses = validExpenses.map(expense => {
      const totalAmount = expense.amount;
      const newSplitAmount = totalAmount / remainingPeople.length;
      const newSplits = {};
      
      remainingPeople.forEach(person => {
        newSplits[person.id] = newSplitAmount;
      });
      
      return {
        ...expense,
        splits: newSplits
      };
    });
    
    setExpenses(updatedExpenses);
  };

  const updatePerson = (id, name) => {
    setPeople(people.map(person => 
      person.id === id ? { ...person, name: name.trim() } : person
    ));
  };

  const addExpense = (expenseData) => {
    // Prevent adding expense if no people exist
    if (people.length === 0) {
      throw new Error('Cannot add expense without people');
    }

    const newExpense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setExpenses([...expenses, newExpense]);
    return newExpense;
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const updateExpense = (id, expenseData) => {
    setExpenses(expenses.map(expense =>
      expense.id === id ? { ...expense, ...expenseData } : expense
    ));
  };

  const clearAll = async () => {
    setPeople([]);
    setExpenses([]);
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.PEOPLE),
        AsyncStorage.removeItem(STORAGE_KEYS.EXPENSES),
      ]);
    } catch (error) {
      console.error('Error clearing data from AsyncStorage:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        people,
        expenses,
        isLoading,
        addPerson,
        removePerson,
        updatePerson,
        addExpense,
        removeExpense,
        updateExpense,
        clearAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};