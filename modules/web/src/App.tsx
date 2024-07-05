import  { RouterProvider, createBrowserRouter } from 'react-router-dom'
import {ErrorElement} from './components'

import {
  HomeLayout,
  DashboardLayout,
  Landing,
  Error,
  Chat,
  Login,
  Signup,
  Profile,
  Diagnosis,
  ForgotPassword,
  VerificationPage,
  AuthLayout,
} from './pages'
import { ProtectedRoute } from './features/auth/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout/>,
    errorElement: <Error/>,
    children: [
      {
        index: true,
        element: <Landing/>,
        errorElement: <ErrorElement/>,
      }
    ]
  },
  {
    path: '/dashboard',
    element: <DashboardLayout/>,
    errorElement: <Error/>,
    children: [
      {
        index: true,
        element: <Chat/>,
        errorElement: <ErrorElement/>,
      },
      {
        path: 'diagnosis',
        element: <Diagnosis/>,
        errorElement: <ErrorElement/>,
      },
      {
        path: 'profile',
        element: <Profile/>,
        errorElement: <ErrorElement/>,
      },
    ],
  },

  {
    path: '/auth',
    element: <AuthLayout/>,
    errorElement: <Error/>,
    children: [
      {
        path: 'login',
        element: <Login/>,
        errorElement: <ErrorElement/>,

      },
      {
        path: 'signup',
        element: <Signup/>,
        errorElement: <ErrorElement/>,

      },
      {
        path: 'forgot-password',
        element: <ForgotPassword/>,
        errorElement: <ErrorElement/>,

      },
      {
        path: 'verification',
        element: <VerificationPage/>,
        errorElement: <ErrorElement/>,

      }
    ]
  }
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App;
