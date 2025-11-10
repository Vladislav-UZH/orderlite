import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import {
  LoginScreen,
  RegisterScreen,
  MenuScreen,
  OrdersBucketsScreen,
  OrdersActiveScreen,
  OrderStatusScreen,
  CheckoutScreen,
  ProfileScreen,
} from './screens';
import { NotFoundScreen } from './screens/NotFoundScreen';
import { ProtectedRoute } from './screens/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/register',
    element: <RegisterScreen />,
  },

  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <NotFoundScreen />,

    children: [
      {
        index: true,
        element: <Navigate to="/menu" replace />,
      },

      { path: 'menu', element: <MenuScreen /> },
      { path: 'orders', element: <OrdersBucketsScreen /> },
      { path: 'orders/active', element: <OrdersActiveScreen /> },
      { path: 'orders/:id', element: <OrderStatusScreen /> },
      { path: 'checkout', element: <CheckoutScreen /> },
      { path: 'profile', element: <ProfileScreen /> },
    ],
  },

  {
    path: '*',
    element: <NotFoundScreen />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
