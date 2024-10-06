"use client";

import "./UserButton.css";
import { LogOutButton } from "./account";
import { useUser } from "../hooks/useUser";
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import { ChevronRight, LogOut, Settings, X } from "lucide-react";
import Link from "next/link";
import pkgConfig from "../pkgConfig";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={pkgConfig.cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={pkgConfig.cn(
        "z-50 min-w-[8rem] rounded-md bg-transparent text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

export interface UserButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const UserButton = React.forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ className, ...props }, ref) => {
    const { user, loading, refreshUser } = useUser(); // `refreshUser`関数を追加

    React.useEffect(() => {
      const handleCookieChange = () => {
        refreshUser(); // クッキーが変化した際にユーザー情報を更新
      };

      if (typeof window !== undefined) {
        window.addEventListener("sah-sessionchange", handleCookieChange); // クッキーの変化を監視

        return () => {
          window.removeEventListener("sah-sessionchange", handleCookieChange); // クリーンアップ
        };
      }
    }, [refreshUser]);

    if (loading) {
      return (
        <Avatar>
          <AvatarImage
            src={user?.profile.images["90x90"]}
            alt={`@${user?.username}`}
          />
          <AvatarFallback>My</AvatarFallback>
        </Avatar>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage
              src={user?.profile.images["90x90"]}
              alt={`@${user?.username}`}
            />
            <AvatarFallback>My</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="sah-dialog-content">
          <div className="sah-container">
            <div className="sah-main-container">
              <span className="sah-main-user-container">
                <span className="sah-main-user-avatar-container">
                  <Avatar>
                    <AvatarImage
                      src={user?.profile.images["90x90"]}
                      alt={`@${user?.username}`}
                    />
                    <AvatarFallback>My</AvatarFallback>
                  </Avatar>
                </span>
                <span className="sah-main-user-name-container">
                  <span className="sah-main-user-title">{user?.username}</span>
                  <span className="sah-main-user-description">{user?.id}</span>
                </span>
              </span>
              <div className="sah-main-user-options-container">
                <div className="sah-main-user-options-layout">
                  <Link
                    className="sah-main-user-option-button"
                    target="_blank"
                    href="https://scratch.mit.edu/accounts/settings/"
                  >
                    <span className="sah-main-user-option-button-icon">
                      <Settings />
                    </span>
                    Settings
                  </Link>
                  <LogOutButton className="sah-main-user-option-button">
                    <span className="sah-main-user-option-button-icon">
                      <LogOut />
                    </span>
                    Log out
                  </LogOutButton>
                </div>
              </div>
            </div>
            <div className="sah-footer-container">
              <div className="sah-footer-body">
                <div className="sah-footer-layout">
                  <div className="sah-footer-content">
                    <div className="sah-footer-items">
                      <p className="sah-footer-text">Secured by</p>
                      <a className="sah-footer-text">ScratchAuth</a>
                      {/* <a className="sah-footer-brand">ScratchAuth</a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
UserButton.displayName = "UserButton";
