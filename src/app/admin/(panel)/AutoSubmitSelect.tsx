"use client";

/** A <select> that submits its parent form (a server action) as soon as it changes. */
export function AutoSubmitSelect({ name, defaultValue, options, className }: { name: string; defaultValue: string; options: readonly string[]; className?: string }) {
  return (
    <select name={name} defaultValue={defaultValue} onChange={(e) => e.currentTarget.form?.requestSubmit()} className={className} aria-label={name}>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}
