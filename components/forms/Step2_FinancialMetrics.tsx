"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateBundleFormValues } from "@/lib/types/createBundleForm";

export function Step2_FinancialMetrics() {
  const {
    register,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext<CreateBundleFormValues>();
  const totalGoal = Number(watch("totalGoal")) || 0;
  const seniorTarget = Number(watch("seniorTarget")) || 0;
  const juniorTarget = Number(watch("juniorTarget")) || 0;
  const seniorRate = Number(watch("seniorFixedRate")) || 0;
  const juniorApy = Number(watch("juniorAPY")) || 0;
  const allocationGap = totalGoal - (seniorTarget + juniorTarget);

  const allocationValidator = () =>
    Number(getValues("seniorTarget")) + Number(getValues("juniorTarget")) === Number(getValues("totalGoal")) ||
    "Senior and junior targets must add up to the total fundraising goal.";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <Label>Total Fundraising Goal (USDC) *</Label>
          <Input
            type="number"
            min={10000}
            step={1}
            placeholder="e.g. 50000"
            className="mt-1"
            {...register("totalGoal", {
              required: "Total fundraising goal is required.",
              min: {
                value: 10000,
                message: "The total goal must be greater than or equal to $10,000.",
              },
              valueAsNumber: true,
              validate: {
                isWholeNumber: (value) =>
                  Number.isInteger(value) || "Use whole USDC amounts only.",
                matchesAllocation: allocationValidator,
              },
            })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Set the total amount you aim to raise. It must be at least $10,000, and entered as a whole-number USDC amount.
          </p>
          {errors.totalGoal && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.totalGoal.message}</p>
          )}
        </div>
        <div>
          <Label>Expected APY (Junior Tranche) *</Label>
          <Input
            type="number"
            min={0.01}
            max={100}
            step={0.01}
            placeholder="1"
            className="mt-1"
            {...register("juniorAPY", {
              required: "Expected junior APY is required.",
              min: { value: 0.01, message: "Expected junior APY must be greater than 0%." },
              max: { value: 100, message: "Keep the projected APY within 0 to 100%." },
              valueAsNumber: true,
            })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Enter the projected annual return shown to investors for reference. Use up to two decimal places.
          </p>
          {errors.juniorAPY && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.juniorAPY.message}</p>
          )}
        </div>
        <div>
          <Label>Senior Tranche Investment Target (USDC) *</Label>
          <Input
            type="number"
            min={0}
            step={1}
            className="mt-1"
            {...register("seniorTarget", {
              required: "Senior tranche target is required.",
              min: { value: 0, message: "Senior target cannot be negative." },
              valueAsNumber: true,
              validate: {
                isWholeNumber: (value) =>
                  Number.isInteger(value) || "Use whole USDC amounts only.",
                matchesAllocation: allocationValidator,
              },
            })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Define the amount reserved for the lower-risk senior tranche. Use whole-number USDC values only.
          </p>
          {errors.seniorTarget && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.seniorTarget.message}</p>
          )}
        </div>
        <div>
          <Label>Junior Tranche Investment Target (USDC) *</Label>
          <Input
            type="number"
            min={0}
            step={1}
            className="mt-1"
            {...register("juniorTarget", {
              required: "Junior tranche target is required.",
              min: { value: 0, message: "Junior target cannot be negative." },
              valueAsNumber: true,
              validate: {
                isWholeNumber: (value) =>
                  Number.isInteger(value) || "Use whole USDC amounts only.",
                matchesAllocation: allocationValidator,
              },
            })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Set the first-loss junior capital allocation. Combined with the senior target, it must equal the total goal.
          </p>
          {errors.juniorTarget && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.juniorTarget.message}</p>
          )}
        </div>
        <div>
          <Label>Subordination Rate (%) *</Label>
          <Input
            type="number"
            min={5}
            max={50}
            step={0.01}
            placeholder="40"
            className="mt-1"
            {...register("subordinationRate", {
              required: "Subordination rate is required.",
              min: { value: 5, message: "Subordination rate must be at least 5%." },
              max: { value: 50, message: "Subordination rate cannot exceed 50%." },
              valueAsNumber: true,
            })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Enter the junior first-loss share of the pool. The contract currently supports a range of 5% to 50%.
          </p>
          {errors.subordinationRate && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.subordinationRate.message}</p>
          )}
        </div>
        <div>
          <Label>Senior Fixed Rate (%) *</Label>
          <Input
            type="number"
            min={0.01}
            max={100}
            step={0.01}
            defaultValue={1}
            className="mt-1"
            {...register("seniorFixedRate", {
              required: "Senior fixed rate is required.",
              min: { value: 0.01, message: "Senior fixed rate must be greater than 0%." },
              max: { value: 100, message: "Senior fixed rate cannot exceed 100%." },
              valueAsNumber: true,
            })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Set the contractual annual rate for the senior tranche before any junior upside is considered.
          </p>
          {errors.seniorFixedRate && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.seniorFixedRate.message}</p>
          )}
        </div>
        <div>
          <Label>Junior Fixed Rate (%) *</Label>
          <Input
            type="number"
            min={0}
            max={100}
            step={0.01}
            defaultValue={1}
            className="mt-1"
            {...register("juniorFixedRate", {
              required: "Junior fixed rate is required.",
              min: { value: 0, message: "Junior fixed rate cannot be negative." },
              max: { value: 100, message: "Junior fixed rate cannot exceed 100%." },
              valueAsNumber: true,
            })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Define the baseline annual rate attached to the junior tranche before any additional performance upside.
          </p>
          {errors.juniorFixedRate && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.juniorFixedRate.message}</p>
          )}
        </div>
        <div>
          <Label>Fundraising Start Date *</Label>
          <Input
            type="date"
            className="mt-1"
            {...register("startDate", {
              required: "Fundraising start date is required.",
            })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Choose the date investors can begin committing capital into the bundle.
          </p>
          {errors.startDate && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <Label>Fundraising End Date *</Label>
          <Input
            type="date"
            className="mt-1"
            {...register("endDate", {
              required: "Fundraising end date is required.",
              validate: (value) =>
                !getValues("startDate") ||
                new Date(value).getTime() > new Date(getValues("startDate")).getTime() ||
                "End date must be later than the start date.",
            })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Set the closing date after which new subscriptions should no longer be accepted.
          </p>
          {errors.endDate && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.endDate.message}</p>
          )}
        </div>
        <div>
          <Label>Repayment Frequency *</Label>
          <select
            className="flex h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-primary)] mt-1"
            {...register("repaymentFrequency", { required: true })}
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Bi-Annual">Bi-Annual</option>
          </select>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Pick how often the originator is expected to repay principal and yield into the pool.
          </p>
        </div>
        <div>
          <Label>Total Number of Repayment Cycles *</Label>
          <Input
            type="number"
            min={1}
            max={120}
            step={1}
            className="mt-1"
            {...register("totalRepaymentCycles", {
              required: "Total repayment cycles is required.",
              min: { value: 1, message: "Use at least one repayment cycle." },
              max: { value: 120, message: "Keep repayment cycles within a practical range." },
              valueAsNumber: true,
            })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Specify the total number of scheduled repayment periods over the life of the pool.
          </p>
          {errors.totalRepaymentCycles && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.totalRepaymentCycles.message}</p>
          )}
        </div>
        <div>
          <Label>Estimated First Repayment Date *</Label>
          <Input
            type="date"
            className="mt-1"
            {...register("estimatedFirstRepayment", {
              required: "Estimated first repayment date is required.",
              validate: (value) =>
                !getValues("endDate") ||
                new Date(value).getTime() >= new Date(getValues("endDate")).getTime() ||
                "First repayment should not be earlier than the fundraising end date.",
            })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Enter the first date investors should expect repayment activity after the raise closes.
          </p>
          {errors.estimatedFirstRepayment && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.estimatedFirstRepayment.message}</p>
          )}
        </div>
        <div>
          <Label>Redemption Rate (%) *</Label>
          <Input
            type="number"
            min={0}
            max={100}
            step={0.01}
            placeholder="100"
            className="mt-1"
            {...register("redemptionRate", {
              required: "Redemption rate is required.",
              min: { value: 0, message: "Redemption rate cannot be negative." },
              max: { value: 100, message: "Redemption rate cannot exceed 100%." },
              valueAsNumber: true,
            })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Define the expected percentage of principal investors can redeem at maturity under the base case.
          </p>
          {errors.redemptionRate && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.redemptionRate.message}</p>
          )}
        </div>
      </div>
      <div>
        <div className="card-surface p-5 sticky top-24">
          <h4 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
            Pool Summary Preview
          </h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Total Pool</dt>
              <dd className="font-mono text-[var(--text-primary)]">
                ${(totalGoal || 0).toLocaleString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Senior</dt>
              <dd className="font-mono text-[var(--senior-tranche)]">
                ${seniorTarget.toLocaleString()} ({totalGoal ? ((seniorTarget / totalGoal) * 100).toFixed(0) : 0}%)
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Junior</dt>
              <dd className="font-mono text-[var(--junior-tranche)]">
                ${juniorTarget.toLocaleString()} ({totalGoal ? ((juniorTarget / totalGoal) * 100).toFixed(0) : 0}%)
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Senior APY</dt>
              <dd className="font-mono">{seniorRate}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Junior APY</dt>
              <dd className="font-mono">{juniorApy}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Repayments</dt>
              <dd className="font-mono">
                {watch("repaymentFrequency") || "Monthly"} × {watch("totalRepaymentCycles") || "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Allocation Check</dt>
              <dd className={`font-mono ${allocationGap === 0 ? "text-[var(--success)]" : "text-[var(--warning)]"}`}>
                {allocationGap === 0 ? "Balanced" : `${allocationGap > 0 ? "+" : ""}${allocationGap.toLocaleString()} USDC`}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
