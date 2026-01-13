import React, { Suspense } from "react";
import CardClientContent from "./CardClientContent";
export const dynamic = "force-dynamic";
export default function BirthdayCardPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-white">Loading Party...</div>}>
      <CardClientContent />
    </Suspense>
  );
}