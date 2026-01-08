// src/components/offline-indicator.tsx
import { useOfflineStore } from "../store/index";
import { WifiOff, Wifi } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

export function OfflineIndicator() {
  const { isOnline, queue } = useOfflineStore();
  const { t } = useTranslation();

  if (isOnline && queue.length === 0) {
    return null;
  }

  return (
    <Badge
      variant={isOnline ? "secondary" : "destructive"}
      className="flex items-center gap-2"
      role="status"
      aria-live="polite"
    >
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3" aria-hidden="true" />
          <span>
            {t("syncing")} ({queue.length})
          </span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" aria-hidden="true" />
          <span>{t("offline")}</span>
        </>
      )}
    </Badge>
  );
}
