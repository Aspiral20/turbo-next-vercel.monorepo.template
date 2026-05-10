import { SidebarItem } from "@/_components/settings/SettingsSectionSidebar";
import { routes } from "@/routes";
import { Pencil, Lock, Sparkles } from "lucide-react";
import { v4 as uuid } from 'uuid';
import type { AppDispatch } from "@/store";
// import { openOnboardingModal } from "@/store/slices/uiSlice";

export const PROFILE_SIDEBAR_ITEMS: (dispatch: AppDispatch) => SidebarItem[] = (dispatch) => [
  { id: uuid(), label: 'Edit Profile', icon: Pencil, href: routes.i18n.dashboard.settings.profile.edit },
  { id: uuid(), label: 'Change Password', icon: Lock, href: routes.i18n.dashboard.settings.profile.changePassword },
  // { id: uuid(), label: 'Onboarding', icon: Sparkles, onClick: () => dispatch(openOnboardingModal()) },
];