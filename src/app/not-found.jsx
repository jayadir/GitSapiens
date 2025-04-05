import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/button";
export default function notFound() {
  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <Image src="/images/notFound.png" width={500} height={500} alt="404" />
      <Link href="/dashboard" className="mt-4">
        <Button> Back To Dahsboard</Button>
      </Link>
    </div>
  );
}
