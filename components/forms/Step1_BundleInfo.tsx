"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateBundleFormValues } from "@/lib/types/createBundleForm";
import { Upload, FileText, X } from "lucide-react";

export function Step1_BundleInfo() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateBundleFormValues>();
  const oneliner = watch("oneliner") ?? "";
  const desc = watch("description") ?? "";
  const pdfName = watch("contractPdfName") ?? "";
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (file && file.type === "application/pdf") {
      setValue("contractPdfName", file.name, { shouldDirty: true, shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Bundle Name *</Label>
        <Input
          id="name"
          placeholder="e.g. QuillFi Genesis Pool"
          className="mt-1.5"
          {...register("name", {
            required: "Bundle name is required.",
            minLength: {
              value: 4,
              message: "Use at least 4 characters so the bundle name is clear.",
            },
          })}
        />
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Choose the investor-facing name shown across listings, review queues, and portfolio views.
        </p>
        {errors.name && <p className="text-xs text-[var(--error)] mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="oneliner">One-line Introduction *</Label>
        <Input
          id="oneliner"
          maxLength={120}
          placeholder="Short tagline for the bundle"
          className="mt-1.5"
          {...register("oneliner", {
            required: "A one-line introduction is required.",
            maxLength: {
              value: 120,
              message: "Keep the intro within 120 characters.",
            },
          })}
        />
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Summarize the borrower segment, geography, or financing thesis in one crisp sentence. {oneliner.length}/120
        </p>
        {errors.oneliner && (
          <p className="text-xs text-[var(--error)] mt-1">{errors.oneliner.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Bundle Description *</Label>
        <textarea
          id="description"
          rows={4}
          placeholder="Full description of the student loan pool..."
          className="flex w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] mt-1.5 resize-none"
          {...register("description", {
            required: "A detailed bundle description is required.",
            minLength: {
              value: 40,
              message: "Add a little more context for reviewers and investors.",
            },
          })}
        />
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Explain the originator, student borrower profile, market, repayment model, and why this pool matters. {desc.length} chars
        </p>
        {errors.description && (
          <p className="text-xs text-[var(--error)] mt-1">{errors.description.message}</p>
        )}
      </div>
      <div>
        <Label>Contract PDF Upload (optional)</Label>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Attach the term sheet, legal agreement, or diligence memo reviewers should use to verify the bundle.
        </p>
        <div
          className={`mt-1.5 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver
              ? "border-[var(--primary)] bg-[var(--primary)]/5"
              : "border-[var(--border)] hover:border-[var(--text-muted)]"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0]);
          }}
        >
          {pdfName ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-[var(--primary)]" />
              <div className="text-left">
                <p className="text-sm font-medium text-[var(--text-primary)]">{pdfName}</p>
                <p className="text-xs text-[var(--text-muted)]">PDF uploaded</p>
              </div>
              <button
                type="button"
                onClick={() => setValue("contractPdfName", "")}
                className="ml-2 p-1 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--error)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-[var(--text-muted)] mx-auto mb-3" />
              <p className="text-sm text-[var(--text-muted)]">
                Drag and drop PDF here, or{" "}
                <label
                  htmlFor="contractPdfInput"
                  className="cursor-pointer text-[var(--primary)] hover:underline font-medium"
                >
                  browse
                </label>
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">PDF only, up to 10MB.</p>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="contractPdfInput"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
