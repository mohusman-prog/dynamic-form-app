// App.js
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
} from "react-router-dom";
import DynamicForm from "./components/DynamicForm";
import SubTable from "./components/SubTable";

// Layout component (wraps nav + children)
function Layout() {
  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <Link to="/">Form</Link>
        <Link to="/submissions">Submissions</Link>
      </nav>

      {/* Child routes render here */}
      <Outlet />
    </div>
  );
}

// Router setup
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // layout contains nav + Outlet
    children: [
      { index: true, element: <DynamicForm /> },
      { path: "submissions", element: <SubTable /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
