
import * as React from "react";
import LogDayForm from "./log-day-form";

export default function LogDayPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LogDayForm />
    </React.Suspense>
  );
}
