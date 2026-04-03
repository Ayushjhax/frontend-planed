"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useForm, FormProvider, type FieldPath } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Step1_BundleInfo } from "@/components/forms/Step1_BundleInfo";
import { Step2_FinancialMetrics } from "@/components/forms/Step2_FinancialMetrics";
import { Step3_VaultPreview } from "@/components/forms/Step3_VaultPreview";
import { Step4_Review } from "@/components/forms/Step4_Review";
import { useBundleStore } from "@/lib/stores/useBundleStore";
import { useWalletStore } from "@/lib/stores/useWalletStore";
import { useToastStore } from "@/lib/stores/useToastStore";
import {
  BUNDLE_CREATION_FEE_RECIPIENT,
  BUNDLE_CREATION_FEE_SOL,
  createAssetPoolOnChain,
} from "@/lib/solana/program";
import {
  createBundleDefaultValues,
  type CreateBundleFormValues,
} from "@/lib/types/createBundleForm";
import { ArrowLeft, Check } from "lucide-react";

const steps = [
  { id: 1, title: "Bundle Info" },
  { id: 2, title: "Financial Metrics" },
  { id: 3, title: "Vault Preview" },
  { id: 4, title: "Review & Submit" },
];

const stepFields: Record<number, FieldPath<CreateBundleFormValues>[]> = {
  1: ["name", "oneliner", "description"],
  2: [
    "totalGoal",
    "juniorAPY",
    "seniorTarget",
    "juniorTarget",
    "subordinationRate",
    "seniorFixedRate",
    "juniorFixedRate",
    "startDate",
    "endDate",
    "repaymentFrequency",
    "totalRepaymentCycles",
    "estimatedFirstRepayment",
    "redemptionRate",
  ],
  3: [],
  4: [],
};

export default function CreateBundlePage() {
  const [step, setStep] = useState(1);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const router = useRouter();
  const refreshBundles = useBundleStore((s) => s.refreshBundles);
  const addToast = useToastStore((s) => s.addToast);
  const connected = useWalletStore((s) => s.connected);

  const form = useForm<CreateBundleFormValues>({
    defaultValues: createBundleDefaultValues,
    mode: "onTouched",
  });

  const sendUserToFirstInvalidStep = () => {
    const errorKeys = Object.keys(form.formState.errors);
    if (stepFields[1].some((field) => errorKeys.includes(field))) {
      setStep(1);
      return;
    }
    if (stepFields[2].some((field) => errorKeys.includes(field))) {
      setStep(2);
    }
  };

  const validateStepsUntil = async (targetStep: number) => {
    const requiredFields = Object.entries(stepFields)
      .filter(([id]) => Number(id) < targetStep)
      .flatMap(([, fields]) => fields);

    if (requiredFields.length === 0) return true;

    const valid = await form.trigger(requiredFields);
    if (!valid) {
      sendUserToFirstInvalidStep();
      addToast("Please fix the highlighted bundle details before continuing.", "error");
    }
    return valid;
  };

  const goToStep = async (targetStep: number) => {
    if (targetStep <= step) {
      setStep(targetStep);
      return;
    }

    const valid = await validateStepsUntil(targetStep);
    if (valid) {
      setStep(targetStep);
    }
  };

  const goNext = async () => {
    if (step >= 4) return;
    const valid = await validateStepsUntil(step + 1);
    if (valid) {
      setStep((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleFinalSubmit = async () => {
    const isValid = await validateStepsUntil(4);
    if (!isValid) {
      return;
    }

    const values = form.getValues();
    const totalGoal = Number(values.totalGoal);
    const seniorTarget = Number(values.seniorTarget);
    const juniorTarget = Number(values.juniorTarget);

    if (seniorTarget + juniorTarget !== totalGoal) {
      setStep(2);
      addToast("Senior and junior targets must exactly match the total fundraising goal.", "error");
      return;
    }

    setSubmitting(true);

    try {
      if (!anchorWallet) {
        throw new Error("Connect a supported Solana wallet before submitting a bundle.");
      }

      const result = await createAssetPoolOnChain({
        connection,
        wallet: anchorWallet,
        values,
      });

      await refreshBundles(connection);
      addToast(
        `Bundle submitted on-chain for review. Tx: ${result.signature.slice(0, 8)}...`,
        "success"
      );
      router.push("/my-bundle");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Bundle submission failed. Please try again.";

      addToast(message, "error");
    } finally {
      setSubmitting(false);
    }
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
      <p className="text-sm leading-6 text-[var(--text-muted)] mb-8">
        Define the public narrative, tranche terms, and repayment structure investors
        will review before the bundle can go live on Solana.
      </p>
      {!connected && (
        <div className="mb-8 rounded-2xl border border-[var(--warning)]/30 bg-[var(--warning)]/10 px-4 py-3 text-sm text-[var(--text-muted)]">
          Connect your wallet to submit a bundle on devnet. Drafts are no longer stored locally.
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              type="button"
              onClick={() => void goToStep(s.id)}
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
              <Button type="button" onClick={() => void goNext()}>
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinalSubmit}
                disabled={!confirmChecked || submitting || !connected}
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
