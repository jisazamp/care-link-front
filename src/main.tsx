// import '../wdyr.js';
import "antd/dist/reset.css";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { App } from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

export const queryClient = new QueryClient();
dayjs.locale(es);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
