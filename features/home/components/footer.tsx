import Link from "next/link";
import { Github as LucideGithub } from "lucide-react";
import Image from "next/image";

interface ProjectLink {
  href: string | null;
  text: string;
  description: string;
  icon: string;
  iconDark?: string;
  isNew?: boolean;
}

export function Footer() {
  const socialLinks = [
    {
      href: "https://www.github.com/Aneeshie",
      icon: (
        <LucideGithub className="w-5 h-5 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors" />
      ),
    },
  ];

  return (
    <footer className="border-t border-red-200 dark:border-red-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col items-center space-y-6 text-center">
        {/* Social Links */}
        <div className="flex gap-4">
          {socialLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon}
            </Link>
          ))}
        </div>

        {/* Copyright Notice */}
        <p className="text-sm text-red-600 dark:text-red-400">
          &copy; {new Date().getFullYear()} Aneeshie. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
