import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Video,
  MessageSquare,
  Calendar,
  Settings,
  Image,
} from "lucide-react";
import { useAuthStore } from "../../store/index";
import { useTranslation } from "react-i18next";

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const patientLinks = [
    { href: "/dashboard", label: t("dashboard"), icon: Home },
    { href: "/consultations", label: t("consultations"), icon: Video },
    { href: "/messages", label: t("messages"), icon: MessageSquare },
    { href: "/appointments", label: t("appointments"), icon: Calendar },
    { href: "/photos", label: t("photoComparison"), icon: Image },
    { href: "/settings", label: t("settings"), icon: Settings },
  ];

  const doctorLinks = [
    { href: "/dashboard", label: t("dashboard"), icon: Home },
    { href: "/consultations", label: t("consultations"), icon: Video },
    { href: "/messages", label: t("messages"), icon: MessageSquare },
    { href: "/settings", label: t("settings"), icon: Settings },
  ];

  const links = user?.role === "doctor" ? doctorLinks : patientLinks;

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-muted/10">
      <nav className="flex-1 space-y-1 p-4" aria-label="Main navigation">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;

          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "focus-visible-ring",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
