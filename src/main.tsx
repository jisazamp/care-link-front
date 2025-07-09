//import "../wdrj.ts";
import "antd/dist/reset.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

export const queryClient = new QueryClient();
dayjs.locale(es);

createRoot(document.getElementById("root") ?? new HTMLElement()).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
