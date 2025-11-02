import SignInFormClient from "@/features/auth/components/signin-form";
import React from "react";

const SignInPage = () => {
  return (
    <div className="w-full flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SignInFormClient />
    </div>
  );
};

export default SignInPage;
