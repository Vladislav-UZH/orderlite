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

const NotFound = () => (
  <div style={{ padding: 16 }}>
    <h2>404</h2>
    <p>Page not found</p>
    <a href="/menu">Go to Menu</a>
  </div>
);
const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/menu" replace /> },

  // auth
  { path: '/login', element: <LoginScreen /> },
  { path: '/register', element: <RegisterScreen /> },

  // app
  { path: '/menu', element: <MenuScreen /> },
  { path: '/orders', element: <OrdersBucketsScreen /> },
  { path: '/orders/active', element: <OrdersActiveScreen /> },
  { path: '/order/:id', element: <OrderStatusScreen /> },
  { path: '/checkout', element: <CheckoutScreen /> },
  { path: '/profile', element: <ProfileScreen /> },

  // 404
  { path: '*', element: <NotFound /> },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
