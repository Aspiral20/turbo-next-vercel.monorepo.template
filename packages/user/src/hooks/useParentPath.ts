import { usePathname } from "@/i18n/navigation";

/**
 * pathname.split("/") → ["", "onboarding", "something"]
 * filter(Boolean) → ["onboarding", "something"]
 * pop() → ["onboarding"]
 * join("/") → "onboarding"
 * parentPath = "/onboarding"
 **/
const useParentPath = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  segments.pop();
  const parentPath = "/" + segments.join("/");

  return { parentPath, pathname }
};

export default useParentPath;