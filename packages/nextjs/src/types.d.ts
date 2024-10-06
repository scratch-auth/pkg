export interface ScratchAuthConfig {
  COOKIE_NAME?: string;
  redirect_url?: string;
  title?: string;
  expiration?: number;
  cn: Function;
  debug?: boolean;
}

export type ResponseProps = { status: number; code: string; message: string };
export type ResponseErrorProps = {
  status: number;
  code: string;
  message: string;
};

export type Session = string | null | undefined;
export type User = {
  id: number;
  username: string;
  scratchteam: boolean;
  history: {
    joined: string;
  };
  profile: {
    id: number;
    images: {
      "90x90": string;
      "60x60": string;
      "55x55": string;
      "50x50": string;
      "32x32": string;
    };
    status: string;
    bio: string;
    country: string;
  };
};
