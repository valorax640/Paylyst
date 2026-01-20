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
    setPeople([...people, newPerson]);
    return newPerson;
  };

  const removePerson = (id) => {
    setPeople(people.filter(person => person.id !== id));
    // Also remove expenses related to this person
    setExpenses(expenses.filter(expense => expense.payer.id !== id));
  };

  const updatePerson = (id, name) => {
    setPeople(people.map(person => 
      person.id === id ? { ...person, name: name.trim() } : person
    ));
  };

  const addExpense = (expenseData) => {
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