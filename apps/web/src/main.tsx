import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import "./styles.css";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/:rest*" component={Login} />
      </Switch>
    </QueryClientProvider>
  </React.StrictMode>
);

