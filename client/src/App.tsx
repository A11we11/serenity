/* import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { router } from "@/app/Router";
import { useThemeStore } from "@/store/index";
import "@/i18n/config";
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
 */

import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { router } from "@/app/Router";
import { useThemeStore } from "@/store";
import "@/i18n/config";
import "./index.css";

const queryClient = new QueryClient();

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
