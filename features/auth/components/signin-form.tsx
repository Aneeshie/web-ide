import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChromeIcon, GithubIcon } from "lucide-react";
import { handleGoogleSignIn, handleGithubSignIn } from "../actions";

const SignInFormClient = () => {
  return (
    <Card className="w-full max-w-md border-zinc-700 bg-zinc-900/50 backdrop-blur-sm shadow-2xl">
      <CardHeader className="space-y-3 text-center pb-6">
        <CardTitle className="text-3xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Sign In
        </CardTitle>
        <CardDescription className="text-center text-zinc-300 text-base">
          Choose Your Preferred Sign In Method
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <form action={handleGoogleSignIn}>
          <Button
            type="submit"
            variant={"outline"}
            className="w-full h-12 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 bg-zinc-800/50"
          >
            <ChromeIcon className="mr-2 size-4 text-zinc-300" />
            <span className="text-zinc-200">Sign In With Goggle</span>
          </Button>
        </form>
        <form action={handleGithubSignIn}>
          <Button
            type="submit"
            variant={"outline"}
            className="w-full h-12 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 bg-zinc-800/50"
          >
            <GithubIcon className="mr-2 size-4 text-zinc-300" />
            <span className="text-zinc-200">Sign In With Github</span>
          </Button>
          <CardFooter className="flex justify-center pt-4">
            <a
              href="#"
              className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
            >
              Privacy Policy
            </a>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInFormClient;
