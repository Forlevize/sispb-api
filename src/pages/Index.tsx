
import React from "react";
import { AuthProvider } from "../contexts/AuthContext";
import AppRoutes from "../routes/AppRoutes";

export default function Index() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
