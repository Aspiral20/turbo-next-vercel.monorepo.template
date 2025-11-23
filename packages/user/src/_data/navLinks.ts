import { v4 as uuid } from 'uuid';
import { routes } from "@/routes";

export const navLinks = [
  { id: uuid(), href: routes.i18n.first, label: 'First Page' },
  { id: uuid(), href: routes.i18n.second, label: 'Second Page' },
  { id: uuid(), href: routes.i18n.third.self, label: 'Third Page' },
]