import { useMemo } from 'react';
import { useUserStore } from '../stores/userStore';

export const useSalaryCalculator = () => {
  const { monthlySalary, dailyHours, workingDays } = useUserStore();

  // 計算每月總工時：每日工時 × 工作天數
  const monthlyHours = useMemo(() => {
    return dailyHours * workingDays;
  }, [dailyHours, workingDays]);

  const ratePerSecond = useMemo(() => {
    if (monthlySalary <= 0 || monthlyHours <= 0) return 0;
    // 計算每小時薪資，然後除以 3600 得到每秒
    const hourlyRate = monthlySalary / monthlyHours;
    return hourlyRate / 3600;
  }, [monthlySalary, monthlyHours]);

  const ratePerHour = useMemo(() => {
    if (monthlySalary <= 0 || monthlyHours <= 0) return 0;
    return monthlySalary / monthlyHours;
  }, [monthlySalary, monthlyHours]);

  return {
    ratePerSecond,
    ratePerHour,
    monthlyHours,
  };
};
