import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import BoardPage from '../pages/BoardPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <BoardPage />,
      },
    ],
  },
])