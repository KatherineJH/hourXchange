import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import advertisementRouter from "./router/advertisementRouter";

function App() {
  const routes = advertisementRouter();

  return (
    <Router>
      <Routes>
        {routes.map(({ path, element }, i) => (
          <Route key={i} path={path} element={element} />
        ))}
      </Routes>
    </Router>
  );
}
