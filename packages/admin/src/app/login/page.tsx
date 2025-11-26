'use client'
import React, { FC, MouseEventHandler, useState } from 'react';
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { routes } from "@/routes";
import Link from "next/link";
import { fail } from "node:assert";

interface PageProps {
}

const Page: FC<PageProps> = ({}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      await signIn('credentials', {
        email: 'verceluser@gmail.com',
        password: 'password',
        redirect: false,
      });
    } catch (err) {
      console.error(`Something went wrong!: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {!isLoading ? !session?.authenticated ? (
            <ol className="font-mono flex flex-col gap-2 list-inside list-decimal text-sm/6 text-center sm:text-left">
              <li className="tracking-[-.01em]">
                <button onClick={handleClick}>
                  Login with credentials: email: verceluser@gmail.com password: password
                </button>
              </li>
              <li className="tracking-[-.01em]">
                <button onClick={() => signIn("github")}>
                  Login with GitHub
                </button>
              </li>
              <li className="tracking-[-.01em]">
                <button onClick={() => signIn("google")}>
                  Login with Google
                </button>
              </li>
            </ol>
          ) : (
            <div>You are logged in. Go on <Link href={routes.self} className="font-bold">Home page</Link></div>
          ): (
          <>Loading...</>
          )}
      </main>
    </div>
  );
};

export default Page;