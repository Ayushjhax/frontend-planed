"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";

export function Step1_BundleInfo() {
  const { register, watch, setValue } = useFormContext();
  const oneliner = watch("oneliner") ?? "";
  const desc = watch("description") ?? "";
  const pdfName = watch("contractPdfName") ?? "";
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (file && file.type === "application/pdf") {
      setValue("contractPdfName", file.name);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Bundle Name</Label>
        <Input
          id="name"
          placeholder="e.g. EduFi Genesis Pool"
          className="mt-1.5"
          {...register("name")}
        />
      </div>
      <div>
        <Label htmlFor="oneliner">One-line Introduction (max 120 chars)</Label>
        <Input
          id="oneliner"
          maxLength={120}
          placeholder="Short tagline for the bundle"
          className="mt-1.5"
          {...register("oneliner")}
        />
        <p className="text-xs text-[var(--text-muted)] mt-1">{oneliner.length}/120</p>
      </div>
      <div>
        <Label htmlFor="description">Bundle Description</Label>
        <textarea
          id="description"
          rows={4}
          placeholder="Full description of the student loan pool..."
          className="flex w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] mt-1.5 resize-none"
          {...register("description")}
        />
        <p className="text-xs text-[var(--text-muted)] mt-1">{desc.length} chars</p>
      </div>
      <div>
        <Label>Contract PDF Upload (optional)</Label>
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
              <p className="text-xs text-[var(--text-muted)] mt-1">PDF up to 10MB</p>
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
