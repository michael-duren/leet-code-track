import { Route, Router } from "@solidjs/router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import Problem from "./pages/Problem";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Route component={Layout} path={""}>
        <Route component={Dashboard} path={"/"} />
        <Route component={Problems} path={"/problems"} />
        <Route component={Problem} path={"/add"} />
        <Route component={Problem} path={"/problem/:id"} />
        <Route component={Analytics} path={"/analytics"} />
        <Route component={Settings} path={"/settings"} />
      </Route>
    </Router>
  );
}

export default App;
