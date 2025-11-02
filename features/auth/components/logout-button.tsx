"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { LogOutButtonProps } from "../types";
import { Button } from "@/components/ui/button";

const LogOutButton = ({ children }: LogOutButtonProps) => {
  const router = useRouter();

  const onLogout = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <Button className="cursor-pointer w-full text-left" onClick={onLogout}>
      {children}
    </Button>
  );
};

export default LogOutButton;
