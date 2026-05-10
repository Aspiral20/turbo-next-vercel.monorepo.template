'use client';

import { Save, Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { cn } from "@/_components/ui/utils";

const DEFAULT_ICON = <Save className="h-4 w-4" />;
const DEFAULT_LOADING_ICON = <Loader2 className="h-4 w-4 animate-spin" />;

interface ButtonSyncProps {
  className?: string;
  displayedIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
  loadingText?: React.ReactNode;
  text?: React.ReactNode;
  children?: React.ReactNode;
  isLoading: boolean;
}

const ButtonSync: React.FC<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & ButtonSyncProps> = ({
  className,
  displayedIcon,
  loadingIcon,
  loadingText = 'Saving…',
  text = 'Save Changes',
  isLoading,
  children,
  ...rest
}) => {
  const resolvedDisplayedIcon = displayedIcon ?? DEFAULT_ICON;
  const resolvedLoadingIcon = loadingIcon ?? DEFAULT_LOADING_ICON;
  const cnVariantBlue = "cursor-pointer flex items-center gap-2 rounded-lg bg-[#1A6FFF] px-6 py-2 text-sm text-white hover:bg-[#1557CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

  return (
    <button
      className={cn(cnVariantBlue, className)}
      disabled={rest.disabled ?? isLoading}
      {...rest}
    >
      <span className="inline-flex">{isLoading ? resolvedLoadingIcon : resolvedDisplayedIcon}</span>
      <span>{isLoading ? loadingText : text}</span>
      {children}
    </button>
  )
}

export default ButtonSync;