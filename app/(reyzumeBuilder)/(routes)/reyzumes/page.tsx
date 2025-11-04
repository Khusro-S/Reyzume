import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function ReyzumesPage() {
  return (
    <div className="ml-20 mt-20">
      <h1 className="text-2xl mb-10">Reyzumes</h1>
      <Link href="/">
        <Button>Home</Button>
      </Link>
    </div>
  );
}
