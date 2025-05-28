"use client";

import React from "react";

// Simple providers wrapper that doesn't depend on react-query
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
