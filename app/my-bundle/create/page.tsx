"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Step1_BundleInfo } from "@/components/forms/Step1_BundleInfo";
import { Step2_FinancialMetrics } from "@/components/forms/Step2_FinancialMetrics";
import { Step3_VaultPreview } from "@/components/forms/Step3_VaultPreview";
import { Step4_Review } from "@/components/forms/Step4_Review";
import { useBundleStore } from "@/lib/stores/useBundleStore";
import { useWalletStore } from "@/lib/stores/useWalletStore";
import { useToastStore } from "@/lib/stores/useToastStore";
import { ArrowLeft, Check } from "lucide-react";

interface FormValues {
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

const defaultValues: FormValues = {
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

const steps = [
  { id: 1, title: "Bundle Info" },
  { id: 2, title: "Financial Metrics" },
  { id: 3, title: "Vault Preview" },
  { id: 4, title: "Review & Submit" },
];

export default function CreateBundlePage() {
  const [step, setStep] = useState(1);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const addBundle = useBundleStore((s) => s.addBundle);
  const addToast = useToastStore((s) => s.addToast);
  const walletAddress = useWalletStore((s) => s.address);

  const form = useForm<FormValues>({ defaultValues });

  const goNext = () => {
    if (step < 4) setStep((s) => s + 1);
  };

  const goPrev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleFinalSubmit = async () => {
    const values = form.getValues();
    if (!values.name) {
      addToast("Bundle name is required.", "error");
      setStep(1);
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    const id = `bundle-${Date.now()}`;
    addBundle({
      id,
      name: values.name,
      oneliner: values.oneliner || "New student loan bundle",
      description: values.description || "No description provided.",
      contractPdfName: values.contractPdfName || undefined,
      status: "under_review",
      totalGoal: Number(values.totalGoal) || 50000,
      seniorTarget: Number(values.seniorTarget) || 30000,
      seniorRaised: 0,
      juniorTarget: Number(values.juniorTarget) || 20000,
      juniorRaised: 0,
      seniorAPY: Number(values.seniorAPY) || 0,
      juniorAPY: Number(values.juniorAPY) || 1,
      subordinationRate: Number(values.subordinationRate) || 40,
      seniorFixedRate: Number(values.seniorFixedRate) || 0,
      juniorFixedRate: Number(values.juniorFixedRate) || 1,
      startDate: values.startDate || new Date().toISOString().split("T")[0],
      endDate: values.endDate || new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0],
      repaymentFrequency: values.repaymentFrequency || "Monthly",
      totalRepaymentCycles: Number(values.totalRepaymentCycles) || 12,
      estimatedFirstRepayment: values.estimatedFirstRepayment || "",
      redemptionRate: Number(values.redemptionRate) || 100,
      vaultAddress: "4xK9...mR3q",
      submittedAt: new Date().toISOString(),
      createdBy: walletAddress,
      daysRemaining: 60,
    });
    setSubmitting(false);
    addToast("Bundle submitted for review. You'll be notified once approved.");
    router.push("/my-bundle");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/my-bundle" className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline mb-6">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to My Bundle
      </Link>
      <h1 className="text-2xl text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
        Create Bundle
      </h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Fill in the details to create a new student loan bundle pool.</p>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              type="button"
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                step === s.id
                  ? "bg-[var(--primary)] text-white shadow-lg shadow-blue-500/20"
                  : step > s.id
                    ? "bg-[var(--success)]/15 text-[var(--success)]"
                    : "bg-[var(--surface-2)] text-[var(--text-muted)]"
              }`}
            >
              {step > s.id ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className="text-xs">{s.id}</span>
              )}
              <span className="hidden sm:inline">{s.title}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px mx-1 ${step > s.id ? "bg-[var(--success)]" : "bg-[var(--border)]"}`} />
            )}
          </div>
        ))}
      </div>

      <FormProvider {...form}>
        <div className="space-y-6">
          {step === 1 && <Step1_BundleInfo />}
          {step === 2 && <Step2_FinancialMetrics />}
          {step === 3 && <Step3_VaultPreview />}
          {step === 4 && (
            <>
              <Step4_Review />
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmChecked}
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--border)] bg-[var(--surface-2)] accent-[var(--primary)]"
                />
                <span className="text-sm text-[var(--text-muted)]">
                  I confirm all information is accurate and legally compliant
                </span>
              </label>
            </>
          )}

          <div className="flex justify-between pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              onClick={goPrev}
              disabled={step === 1}
            >
              Previous
            </Button>
            {step < 4 ? (
              <Button type="button" onClick={goNext}>
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinalSubmit}
                disabled={!confirmChecked || submitting}
              >
                {submitting ? "Submitting..." : "Submit for Review"}
              </Button>
            )}
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
