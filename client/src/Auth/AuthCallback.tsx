/* Green Ledger direction: callback feedback is quiet, reassuring, and focused on the next operational step. */
import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, ShieldAlert } from "lucide-react";
import { Link } from "wouter";
import { completeAuth } from "@/Auth/auth";

export default function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    completeAuth(window.location.search)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="callback-screen">
      <div className="callback-card">
        {status === "loading" && <LoaderCircle className="callback-icon callback-icon--loading" size={38} />}
        {status === "success" && <CheckCircle2 className="callback-icon callback-icon--success" size={38} />}
        {status === "error" && <ShieldAlert className="callback-icon callback-icon--error" size={38} />}
        <p className="form-eyebrow">MMNext Auth</p>
        <h1>{status === "loading" ? "Securing your workspace…" : status === "success" ? "You are signed in" : "We could not verify this sign in"}</h1>
        <p>{status === "loading" ? "Please wait while we finish connecting your POS workspace." : status === "success" ? "Your session is ready. You can continue to the POS dashboard." : "The sign-in link may have expired. Please return to the login page and try again."}</p>
        {status !== "loading" && <Link href="/login" className="callback-link">Return to sign in</Link>}
      </div>
    </main>
  );
}
