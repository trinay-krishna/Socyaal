import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/reset.css';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import EmailVerify from './pages/EmailVerify/EmailVerify';
import Home from './pages/Home/Home';
import Quiz from './pages/Quiz/Quiz';
import QuizList from './pages/QuizList/QuizList';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import OfflineQuiz from './pages/OfflineQuiz/OfflineQuiz';
import QuizCreate from './pages/QuizCreate/QuizCreate';

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
  },

  {
    path: '/quiz/:quizID',
    element: <Quiz />,
  },

  {
    path: '/quiz/offline/:quizID',
    element: <OfflineQuiz />,
  },

  {
    path: '/quiz/quizList',
    element: <QuizList />,

  },

  {
    path: '/quiz/createQuiz',
    element: <QuizCreate />,

  },

  {
    path: '/quiz/leaderboard/:quizID/:page',
    element: <Leaderboard />,
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
