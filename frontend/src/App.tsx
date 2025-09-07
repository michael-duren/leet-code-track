import { Route, Router } from "@solidjs/router";
import Layout from "./layout/layout";
import HomePage from "./routes/home-page";

function App() {
  return (
    <Router>
      <Route component={Layout} path={""}>
        <Route component={HomePage} path={"/"} />
      </Route>
    </Router>
  );
}

export default App;
