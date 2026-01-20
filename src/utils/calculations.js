export const calculateBalances = (people, expenses) => {
  const balances = {};
  
  people.forEach(person => {
    balances[person.id] = 0;
  });

  expenses.forEach(expense => {
    // Payer gets credited
    balances[expense.payer.id] += expense.amount;
    
    // Everyone pays their share
    Object.keys(expense.splits).forEach(personId => {
      balances[personId] -= expense.splits[personId];
    });
  });

  return balances;
};

export const calculateEqualSplit = (amount, people) => {
  const splitAmount = amount / people.length;
  const splits = {};
  people.forEach(person => {
    splits[person.id] = splitAmount;
  });
  return splits;
};

export const calculateSettlements = (balances, people) => {
  const settlements = [];
  const debts = [];
  const credits = [];

  Object.keys(balances).forEach(personId => {
    const person = people.find(p => p.id === personId);
    const balance = balances[personId];
    
    if (balance < -0.01) {
      debts.push({ person, amount: Math.abs(balance) });
    } else if (balance > 0.01) {
      credits.push({ person, amount: balance });
    }
  });

  // Sort by amount
  debts.sort((a, b) => b.amount - a.amount);
  credits.sort((a, b) => b.amount - a.amount);

  let i = 0, j = 0;
  while (i < debts.length && j < credits.length) {
    const debt = debts[i];
    const credit = credits[j];
    const amount = Math.min(debt.amount, credit.amount);

    settlements.push({
      from: debt.person,
      to: credit.person,
      amount: amount,
    });

    debt.amount -= amount;
    credit.amount -= amount;

    if (debt.amount < 0.01) i++;
    if (credit.amount < 0.01) j++;
  }

  return settlements;
};

export const getTotalExpenses = (expenses) => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getPersonExpenses = (personId, expenses) => {
  return expenses.filter(expense => expense.payer.id === personId);
};