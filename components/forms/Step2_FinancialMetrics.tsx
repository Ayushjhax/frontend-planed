"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Step2_FinancialMetrics() {
  const { register, watch } = useFormContext();
  const totalGoal = Number(watch("totalGoal")) || 0;
  const seniorTarget = Number(watch("seniorTarget")) || 0;
  const juniorTarget = Number(watch("juniorTarget")) || 0;
  const seniorRate = Number(watch("seniorFixedRate")) ?? 0;
  const juniorRate = Number(watch("juniorFixedRate")) ?? 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <Label>Total Fundraising Goal (USDC) *</Label>
          <Input
            type="number"
            min={10000}
            placeholder="e.g. 50000"
            className="mt-1"
            {...register("totalGoal", { required: true, min: 10000 })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Minimum $10,000 USDC</p>
        </div>
        <div>
          <Label>Expected APY (Junior Tranche) *</Label>
          <Input
            type="number"
            step={0.1}
            placeholder="1"
            className="mt-1"
            {...register("juniorAPY", { required: true })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Senior tranche is always 0%</p>
        </div>
        <div>
          <Label>Senior Tranche Investment Target (USDC) *</Label>
          <Input type="number" min={0} className="mt-1" {...register("seniorTarget", { required: true })} />
        </div>
        <div>
          <Label>Junior Tranche Investment Target (USDC) *</Label>
          <Input type="number" min={0} className="mt-1" {...register("juniorTarget", { required: true })} />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Must equal Total Goal with Senior
          </p>
        </div>
        <div>
          <Label>Subordination Rate (%) *</Label>
          <Input
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="40"
            className="mt-1"
            {...register("subordinationRate", { required: true })}
          />
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Typically 30-50%</p>
        </div>
        <div>
          <Label>Senior Fixed Rate (%) *</Label>
          <Input type="number" step={0.1} defaultValue={0} className="mt-1" {...register("seniorFixedRate")} />
        </div>
        <div>
          <Label>Junior Fixed Rate (%) *</Label>
          <Input type="number" step={0.1} defaultValue={1} className="mt-1" {...register("juniorFixedRate")} />
        </div>
        <div>
          <Label>Fundraising Start Date *</Label>
          <Input type="date" className="mt-1" {...register("startDate", { required: true })} />
        </div>
        <div>
          <Label>Fundraising End Date *</Label>
          <Input type="date" className="mt-1" {...register("endDate", { required: true })} />
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
        </div>
        <div>
          <Label>Total Number of Repayment Cycles *</Label>
          <Input type="number" min={1} className="mt-1" {...register("totalRepaymentCycles", { required: true })} />
        </div>
        <div>
          <Label>Estimated First Repayment Date *</Label>
          <Input type="date" className="mt-1" {...register("estimatedFirstRepayment", { required: true })} />
        </div>
        <div>
          <Label>Redemption Rate (%) *</Label>
          <Input
            type="number"
            min={0}
            max={100}
            placeholder="100"
            className="mt-1"
            {...register("redemptionRate", { required: true })}
          />
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
              <dd className="font-mono">{juniorRate}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Repayments</dt>
              <dd className="font-mono">
                {watch("repaymentFrequency") || "Monthly"} × {watch("totalRepaymentCycles") || "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
