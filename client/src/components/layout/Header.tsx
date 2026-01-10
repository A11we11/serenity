import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/index";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
                S
              </span>
            </div>
            <span className="font-semibold text-xl">Serenity</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <OfflineIndicator />
          <LanguageSwitcher />
          <ThemeToggle />

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {user.role}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                aria-label={t("logout")}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
