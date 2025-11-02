import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GithubIcon } from "lucide-react";
import { handleGoogleSignIn, handleGithubSignIn } from "../actions";
import { Separator } from "@/components/ui/separator";

const SignInFormClient = () => {
  return (
    <div className="w-full max-w-md space-y-6">
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
          <div className="relative bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <CodeEditorLogo className="h-16 w-16 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Code Editor
        </h1>
      </div>

      {/* Sign In Card */}
      <Card className="border-zinc-700/50 bg-zinc-900/80 backdrop-blur-xl shadow-2xl ring-1 ring-zinc-800/50">
        <CardHeader className="space-y-2 text-center pb-6 pt-8">
          <CardTitle className="text-2xl font-bold text-zinc-100">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Sign in to continue to your workspace
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-6">
          <form action={handleGoogleSignIn}>
            <Button
              type="submit"
              variant="outline"
              className="w-full h-12 group border-zinc-700/50 hover:border-blue-500/50 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300 bg-zinc-800/30 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20"
            >
              <GoogleIcon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="text-zinc-200 font-medium">
                Continue with Google
              </span>
            </Button>
          </form>

          <form action={handleGithubSignIn}>
            <Button
              type="submit"
              variant="outline"
              className="w-full h-12 group border-zinc-700/50 hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300 bg-zinc-800/30 backdrop-blur-sm shadow-lg hover:shadow-purple-500/20"
            >
              <GithubIcon className="mr-3 h-5 w-5 text-zinc-300 group-hover:text-purple-400 group-hover:scale-110 transition-all" />
              <span className="text-zinc-200 font-medium">
                Continue with GitHub
              </span>
            </Button>
          </form>

          <div className="relative py-4">
            <Separator className="bg-zinc-700/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-zinc-900/80 px-3 text-xs text-zinc-500">
                Secure authentication
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pb-6 pt-0">
          <p className="text-xs text-zinc-500 text-center">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

// Code Editor Logo Component
const CodeEditorLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="8"
      y="12"
      width="48"
      height="40"
      rx="4"
      fill="currentColor"
      opacity="0.2"
    />
    <path
      d="M20 24L28 32L20 40M36 24L44 32L36 40"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 20H48M16 44H40"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

// Google Icon Component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default SignInFormClient;
