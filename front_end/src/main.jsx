import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/reset.css';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import EmailVerify from './pages/EmailVerify/EmailVerify';
import Home from './pages/Home/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/home',
    element: <Home />,
  },

  {
    path: '/users/verify/:userID/:token',
    element: <EmailVerify />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
