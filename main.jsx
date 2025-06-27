import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import './index.css'
import Layout from './Layout.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Upload from './Pages/Upload.jsx';
import Explorer from './Pages/Explorer.jsx';
import ErrorBoundary from './Components/ui/ErrorBoundary.jsx';
import { SidebarProvider } from './Components/ui/Sidebar.jsx';
import { debug } from './utils/debug.js';

// Log app initialization
debug.log('main', 'App initialization started');

const AppWrapper = ({ children }) => {
  React.useEffect(() => {
    debug.log('AppWrapper', 'Component mounted', { children: children?.type?.name });
  }, []);
  
  return (
    <SidebarProvider>
      <Layout>
        {children}
      </Layout>
    </SidebarProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/Dashboard" replace />,
  },
  {
    path: "/Dashboard",
    element: <AppWrapper><Dashboard /></AppWrapper>,
  },
  {
    path: "/Upload",
    element: <AppWrapper><Upload /></AppWrapper>,
  },
  {
    path: "/Explorer",
    element: <AppWrapper><Explorer /></AppWrapper>,
  },
]);

debug.log('main', 'Router created', { routes: router.routes.length });

const root = ReactDOM.createRoot(document.getElementById('root'));
debug.log('main', 'React root created');

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>,
);

debug.log('main', 'App rendered'); 