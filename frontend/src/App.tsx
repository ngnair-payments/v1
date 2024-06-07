// import { Suspense } from "react";
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-ignore
// import routes from "~react-pages";
// import { useRoutes } from "react-router-dom";

// function App() {
//   return <Suspense fallback={<p>Loading...</p>}>{useRoutes(routes)}</Suspense>;
// }

import AuthProvider from "./contexts/AuthProvider";
import Router from "./router";

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
