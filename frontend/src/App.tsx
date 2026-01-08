import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/ui/ThemeProvider";
import { router } from "./app/Router";
import { useThemeStore } from "../../frontend/src/store/index";
import "../../frontend/src/i18n/config";
import "./index.css";

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
