"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-stone-700">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-lg border border-stone-200 px-4 py-2 focus:border-[#8B4513] focus:outline-none"
        />
      </div>
      {state?.error && <p role="alert" className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="w-full rounded-lg bg-[#8B4513] py-2 font-medium text-white hover:bg-[#723a10] disabled:opacity-50">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
