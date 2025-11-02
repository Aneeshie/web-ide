import Link from "next/link";
import Image from "next/image";
import UserButton from "@/features/auth/components/user-button";
import { ModeToggle } from "@/components/ui/ThemeToggle";
import { Code2Icon } from "lucide-react";

export function Header() {
  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-50">
        <div className="bg-white dark:bg-black/5 w-full">
          {/* Rest of the header content */}
          <div className="flex items-center justify-center w-full flex-col">
            <div
              className={`
                            flex items-center justify-between
                            bg-linear-to-b from-white/90 via-gray-50/90 to-white/90
                            dark:from-zinc-900/90 dark:via-zinc-800/90 dark:to-zinc-900/90
                            shadow-[0_2px_20px_-2px_rgba(0,0,0,0.1)]
                            backdrop-blur-md
                            border-x border-b 
                            border-[rgba(230,230,230,0.7)] dark:border-[rgba(70,70,70,0.7)]
                            w-full sm:min-w-[800px] sm:max-w-[1200px]
                            rounded-b-[28px]
                            px-4 py-2.5
                            relative
                            transition-all duration-300 ease-in-out
                        `}
            >
              <div className="relative z-10 flex items-center justify-between w-full gap-2">
                {/* Logo Section with Navigation Links */}
                <div className="flex items-center gap-6 justify-center">
                  <Link
                    href="/"
                    className="flex items-center gap-2 justify-center"
                  >
                    <Code2Icon
                      height={50}
                      width={50}
                      className="text-zinc-900 dark:text-zinc-100"
                    />
                    <span className="hidden sm:block font-extrabold text-lg text-zinc-900 dark:text-zinc-100">
                      Code Editor
                    </span>
                  </Link>
                  <span className="text-red-300 dark:text-red-800">|</span>
                  {/* Desktop Navigation Links */}
                  <div className="hidden sm:flex items-center gap-4">
                    <Link
                      href="/docs/components/background-paths"
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      Docs
                    </Link>
                    {/* <Link
                                            href="/pricing"
                                            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                                        >
                                            Pricing
                                        </Link> */}
                    <Link
                      href="https://codesnippetui.pro/templates?utm_source=codesnippetui.com&utm_medium=header"
                      target="_blank"
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-2"
                    >
                      API
                      <span className="text-green-500 dark:text-green-400 border border-green-500 dark:border-green-400 rounded-lg px-1 py-0.5 text-xs">
                        New
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Right side items */}
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-red-300 dark:text-red-800">|</span>
                  {/* <HeaderPro /> */}
                  <ModeToggle />
                  <UserButton />
                </div>

                {/* Mobile Navigation remains unchanged */}
                <div className="flex sm:hidden items-center gap-4">
                  <Link
                    href="/docs/components/action-search-bar"
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    Docs
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    API
                  </Link>
                  <ModeToggle />
                  <UserButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
