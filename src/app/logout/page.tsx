"use client";

import React, { useEffect } from "react";
import { logout } from "./actions";

export default function LogoutPage() {
  useEffect(() => {
    // As soon as this component mounts, call the server action
    logout();
  }, []);

  return <p>Logging out...</p>;
}
