import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "./components/ui";

import RootLayout from "./pages/layout.tsx";
import App from "./pages";
import SignUp from "./pages/sign-up";
import SignIn from "./pages/sign-in";
import PostCreate from "./pages/post/[id]/create.tsx";
import PostDetail from "./pages/post/[id]/detail.tsx";
import Recruit from "./pages/recruit/index.tsx";
import FindTeammates from "./pages/find-teammates/index.tsx";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { initializeSentry } from "@/lib/sentry";
import * as Sentry from "@sentry/react";

import "./index.css";

initializeSentry();

const SentryErrorBoundary = Sentry.withErrorBoundary(
  () => (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <BrowserRouter>
            <Routes>
              <Route element={<RootLayout />}>
                <Route index element={<App />} />
                <Route path="sign-up" element={<SignUp />} />
                <Route path="sign-in" element={<SignIn />} />
                <Route path="recruit" element={<Recruit />} />
                <Route path="recruit/posts/:id" element={<PostDetail />} />
                <Route path="recruit/posts/:id/edit" element={<PostCreate />} />
                <Route path="find-teammates" element={<FindTeammates />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  ),
  {
    fallback: ({ resetError }) => (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">문제가 발생했습니다</h1>
          <p className="mb-4 text-gray-600">잠시 후 다시 시도해주세요.</p>
          <button
            onClick={resetError}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    ),
  }
);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<SentryErrorBoundary />);
}
