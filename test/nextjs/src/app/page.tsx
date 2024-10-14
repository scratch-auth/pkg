import React from "react";
import {
  LogInButton,
  LogIned,
  LogOuted,
  UserButton,
} from "@scratch-auth/nextjs";

export default function Page() {
  return (
    <div>
      <LogOuted>
        <LogInButton />
      </LogOuted>
      <LogIned>
        <UserButton />
      </LogIned>
    </div>
  );
}
