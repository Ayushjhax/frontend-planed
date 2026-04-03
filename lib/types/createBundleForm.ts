export interface CreateBundleFormValues {
  name: string;
  oneliner: string;
  description: string;
  contractPdfName: string;
  totalGoal: number;
  seniorTarget: number;
  juniorTarget: number;
  subordinationRate: number;
  seniorFixedRate: number;
  juniorFixedRate: number;
  seniorAPY: number;
  juniorAPY: number;
  startDate: string;
  endDate: string;
  repaymentFrequency: "Monthly" | "Quarterly" | "Bi-Annual";
  totalRepaymentCycles: number;
  estimatedFirstRepayment: string;
  redemptionRate: number;
}

export const createBundleDefaultValues: CreateBundleFormValues = {
  name: "",
  oneliner: "",
  description: "",
  contractPdfName: "",
  totalGoal: 50000,
  seniorTarget: 30000,
  juniorTarget: 20000,
  subordinationRate: 40,
  seniorFixedRate: 0,
  juniorFixedRate: 1,
  seniorAPY: 0,
  juniorAPY: 1,
  startDate: "",
  endDate: "",
  repaymentFrequency: "Monthly",
  totalRepaymentCycles: 12,
  estimatedFirstRepayment: "",
  redemptionRate: 100,
};
