import { useLanguageStore } from "../store/index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: "en" | "es" | "fr") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[100px]" aria-label="Select language">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
