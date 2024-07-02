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
  Dashboard,
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
        element: <Dashboard/>,
        errorElement: <ErrorElement/>,
      },
      {
        path: 'chat',
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
    path: '/login',
    element: <Login/>
  },
  {
    path: '/signup',
    element: <Signup/>
  }
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App;
