
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";

const pageDetails = {
  "/manage/my-account": {
    title: "My Account",
    description: "Manage your personal profile and account details.",
  },
  "/manage/lab-account": {
    title: "Lab Account",
    description: "View and manage your laboratory account information.",
  },
  "/manage/setup-lab": {
    title: "Setup a New Lab",
    description: "Configure a new laboratory.",
  },
  "/manage/referral-program": {
    title: "Referral Program",
    description: "Manage referral program information.",
  },
  "/manage/email-preferences": {
    title: "Email Subscription Preferences",
    description: "Manage your email notification preferences.",
  },
};

export default function ManagePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const page = pageDetails[location.pathname] || {
    title: "Manage",
    description: "Manage your laboratory settings.",
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 hover:bg-slate-800"
      >
        <ArrowLeft size={18} />
        Go Back
      </button>

      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
          <Settings size={28} />
        </div>

        <h1 className="text-3xl font-bold">{page.title}</h1>

        <p className="mt-3 text-slate-400">{page.description}</p>

        <div className="mt-8 rounded-xl border border-dashed border-slate-700 p-6">
          <p className="text-slate-300">
            This page is connected to navigation. Add the form fields
            and functionality for this section here.
          </p>
        </div>
      </div>
    </div>
  );
}
