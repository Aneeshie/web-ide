import SignInFormClient from "@/features/auth/components/signin-form";
import React from "react";

const SignInPage = () => {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-center">
        <SignInFormClient />
      </div>
    </div>
  );
};

export default SignInPage;
