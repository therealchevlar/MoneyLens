import { useEffect, useState } from 'react';
import { dataService } from '@/src/services/dataService';
import { Account, Goal, RecurringObligation, Transaction } from '@/src/types/finance';

export function useFinanceData() {
  const [account, setAccount] = useState<Account>(dataService.getAccount());
  const [transactions, setTransactions] = useState<Transaction[]>(dataService.getTransactions());
  const [goals, setGoals] = useState<Goal[]>(dataService.getGoals());
  const [recurring, setRecurring] = useState<RecurringObligation[]>(dataService.getRecurringObligations());

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setAccount(dataService.getAccount());
      setTransactions(dataService.getTransactions());
      setGoals(dataService.getGoals());
      setRecurring(dataService.getRecurringObligations());
    });
    return unsubscribe;
  }, []);

  return {
    account,
    transactions,
    goals,
    recurring,
    referenceDate: dataService.getReferenceDate(),
    addGoal: dataService.addGoal.bind(dataService),
    updateGoal: dataService.updateGoal.bind(dataService),
    deleteGoal: dataService.deleteGoal.bind(dataService),
    addTransaction: dataService.addTransaction.bind(dataService),
    resetDemoData: dataService.resetDemoData.bind(dataService),
  };
}
