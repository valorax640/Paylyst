import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);

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

  const clearAll = () => {
    setPeople([]);
    setExpenses([]);
  };

  return (
    <AppContext.Provider
      value={{
        people,
        expenses,
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