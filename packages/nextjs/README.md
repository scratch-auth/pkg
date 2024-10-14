# [Scratch Auth with Next.js](https://scratch-auth.netlify.app/en/docs/nextjs/quickstart)

Scratch Auth is a simple OAuth service for Scratch. It provides developers with an easy-to-understand API and users with a smooth login experience. By using @scratch-auth/nextjs, you can easily implement OAuth functionality into your site.


### [Install](https://scratch-auth.netlify.app/en/docs/nextjs/quickstart#install)

Scratch Auth is composed of a set of NPM packages.

```bash
npm install @scratch-auth/nextjs
```

### [Set your environment variables](https://scratch-auth.netlify.app/en/docs/nextjs/quickstart#set-your-environment-variables)

Add the following keys to your file. These keys can be generated at any time using `openssl rand -hex 32`.

```bash
openssl rand -hex 32
```

```env
SCRATCH_AUTH_SECRET_KEY=***************************************
```

### [Adding a Session Verification Page](https://scratch-auth.netlify.app/en/docs/nextjs/quickstart#adding-a-session-verification-page)

This page will decode the session and verify account information. You need to add this file to the path of the `redirect_url` that you set in `scratch-auth.config.ts`. During the redirect, the session will be set in the `privateCode` parameter.

```tsx filename="app/api/auth/page.tsx"
"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setScratchAuthSession } from "@scratch-auth/nextjs";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const privateCode = searchParams.get("privateCode");

  useEffect(() => {
    async function auth() {
      console.log(privateCode);
      const check = await setScratchAuthSession(privateCode);
      console.log("check", check);
      if (check) {
        console.log("Authentication successful");
      } else {
        console.error("Authentication failed");
      }
      router.push("/");
    }
    auth();
  }, [privateCode]);

  return (
    <div className="flex justify-center items-center w-full h-full min-h-[calc(100dvh-64px)]">
      Authenticating Scratch account...
    </div>
  );
}
```

### [Adding an Authentication Button](https://scratch-auth.netlify.app/en/docs/nextjs/quickstart#adding-a-session-verification-page)

By using Scratch Auth’s pre-built components, you can control the content displayed for logged-in and logged-out users. First, create a header for users to log in or out. To do this, use the following:

- `<LogIned>`: The children of this component are displayed only when the user is logged in.
- `<LogOuted>`: The children of this component are displayed only when the user is logged out.
- `<UserButton />`: A pre-built component with styles ready to display the avatar of the logged-in user’s account.
- `<LogInButton />`: An unstyled component that links to the login page. In this example, since no properties or environment variables are specified for the login URL, the component will link to the login page of the account portal.

```tsx filename="app/page.tsx"
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
```

### [Adding the Package Configuration File](https://scratch-auth.netlify.app/en/docs/nextjs/quickstart#adding-the-package-configuration-file)

| Item         | Description                                 |
| ------------ | ------------------------------------------- |
| COOKIE_NAME  | The name to be stored in the cookie         |
| redirect_url | The URL for the session authentication page |
| title        | Project title                               |
| expiration   | Session expiration time                     |
| cn           | CN function                                 |
| debug        | Debug mode                                  |

```tsx filename="scratch-auth.config.ts"
import { ScratchAuthConfig } from "@scratch-auth/nextjs/src/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const config: ScratchAuthConfig = {
  COOKIE_NAME: "scratch-auth-session",
  redirect_url: `http://localhost:3000/api/auth`,
  title: `Scratch Auth`,
  expiration: 30,
  cn: function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  },
  debug: true,
};

export default config;
```

### [Authenticating the Scratch Account](https://scratch-auth.netlify.app/en/docs/nextjs/quickstart#authenticating-the-scratch-account)

Run your project with the following command:

```bash
npm run dev
```

Access the app’s homepage at [http://localhost:3000 ↗](http://localhost:3000). Sign
up and create the first user.

</Steps>
