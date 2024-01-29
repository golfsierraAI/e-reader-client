import ReactDOM from "react-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ReaderWrapper from "containers/Reader";
import Home from "containers/home";
import NotFoundPage from "containers/notFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/read",
    element: <ReaderWrapper />,
  },
]);

ReactDOM.render(
  <RouterProvider router={router} />,
  document.getElementById("root")
);
