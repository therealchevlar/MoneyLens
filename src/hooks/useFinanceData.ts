import { useEffect, useState } from 'react';
import { dataService } from '@/src/services/dataService';
import { Account, Goal, RecurringObligation, Transaction } from '@/src/types/finance';

export function useFinanceData() {
  const [account, setAccount] = useState<Account>(dataService.getAccount());
  const [transactions, setTransactions] = useState<Transaction[]>(dataService.getTransactions());
  const [goals, setGoals] = useState<Goal[]>(dataService.getGoals());
  const [recurring, setRecurring] = useState<RecurringObligation[]>(dataService.getRecurringObligations());
  const [isOnboarded, setIsOnboarded] = useState<boolean>(dataService.hasCompletedOnboarding());

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setAccount(dataService.getAccount());
      setTransactions(dataService.getTransactions());
      setGoals(dataService.getGoals());
      setRecurring(dataService.getRecurringObligations());
      setIsOnboarded(dataService.hasCompletedOnboarding());
    });
    return unsubscribe;
  }, []);

  return {
    account,
    transactions,
    goals,
    recurring,
    isOnboarded,
    referenceDate: dataService.getReferenceDate(),
    completeOnboarding: dataService.completeOnboarding.bind(dataService),
    addIncome: dataService.addIncome.bind(dataService),
    addExpense: dataService.addExpense.bind(dataService),
    updateMonthlySalary: dataService.updateMonthlySalary.bind(dataService),
    addGoal: dataService.addGoal.bind(dataService),
    updateGoal: dataService.updateGoal.bind(dataService),
    deleteGoal: dataService.deleteGoal.bind(dataService),
    deleteTransaction: dataService.deleteTransaction.bind(dataService),
    addRecurringObligation: dataService.addRecurringObligation.bind(dataService),
    deleteRecurringObligation: dataService.deleteRecurringObligation.bind(dataService),
    resetToFreshWallet: dataService.resetToFreshWallet.bind(dataService),
    loadSampleData: dataService.loadSampleData.bind(dataService),
    resetDemoData: dataService.loadSampleData.bind(dataService),
  };
}
