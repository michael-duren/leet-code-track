// import { JSX, createSignal, createEffect, onMount } from "solid-js";
import { A } from "@solidjs/router";
import {
  House,
  List,
  Plus,
  ChartNoAxesColumnDecreasing,
  Settings,
  Menu,
  Sun,
  Moon,
  X,
} from "lucide-solid";
import { createEffect, createSignal, onMount, type JSX } from "solid-js";
import { Toaster } from "solid-toast";

interface LayoutProps {
  children?: JSX.Element;
  title?: string;
}

const Layout = (props: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false);
  const [currentTheme, setCurrentTheme] = createSignal("light");

  onMount(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  });

  createEffect(() => {
    if (props.title) {
      document.title = `${props.title} - LeetCode Progress Tracker`;
    }
  });

  const toggleTheme = () => {
    const newTheme = currentTheme() === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen());
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: House },
    { path: "/problems", label: "All Problems", icon: List },
    { path: "/add", label: "Add Problem", icon: Plus },
    {
      path: "/analytics",
      label: "Analytics",
      icon: ChartNoAxesColumnDecreasing,
    },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div class="min-h-screen bg-base-100">
      <Toaster
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#f3f4f6",
          },
        }}
        position="top-right"
        gutter={64}
      />
      {/* Mobile header */}
      <div class="navbar bg-base-200 lg:hidden">
        <div class="flex-none">
          <button
            class="btn btn-square btn-ghost"
            onClick={toggleMobileMenu}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
        <div class="flex-1">
          <span class="text-xl font-bold">LeetCode Tracker</span>
        </div>
        <div class="flex-none">
          <button
            class="btn btn-square btn-ghost"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {currentTheme() === "light" ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen() && (
        <div
          class="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
          onClick={closeMobileMenu}
        >
          <div
            class="fixed left-0 top-0 h-full w-64 bg-base-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="flex items-center justify-between p-4 border-b border-base-300">
              <span class="text-xl font-bold">Menu</span>
              <button
                class="btn btn-square btn-ghost btn-sm"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav class="p-4">
              <ul class="menu space-y-2">
                {navItems.map((item) => (
                  <li>
                    <A
                      href={item.path}
                      class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors"
                      activeClass="bg-primary text-primary-content"
                      onClick={closeMobileMenu}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </A>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      <div class="flex">
        {/* Desktop sidebar */}
        <div class="hidden lg:flex w-64 min-h-screen bg-base-200">
          <div class="flex flex-col w-full">
            <div class="flex items-center justify-between p-6 border-b border-base-300">
              <span class="text-xl font-bold">LeetCode Tracker</span>
              <button
                class="btn btn-square btn-ghost btn-sm"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {currentTheme() === "light" ? (
                  <Moon size={20} />
                ) : (
                  <Sun size={20} />
                )}
              </button>
            </div>
            <nav class="flex-1 p-4">
              <ul class="menu space-y-2">
                {navItems.map((item) => (
                  <li>
                    <A
                      href={item.path}
                      class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors"
                      activeClass="bg-primary text-primary-content"
                    >
                      <item.icon size={20} />
                      {item.label}
                    </A>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div class="flex-1 lg:ml-0">
          <main class="container mx-auto p-4 lg:p-8 max-w-7xl">
            {props.children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
