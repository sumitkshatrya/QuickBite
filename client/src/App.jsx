import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminRegister from './pages/admin/AdminRegister.jsx';
import Dashboard from './pages/Dashboard';
import OrderTracking from './pages/OrderTracking';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails.jsx';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import FoodDetails from './pages/FoodDetails';
import Search from './pages/Search';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import DashboardOverview from './pages/admin/DashboardOverview.jsx';
import RestaurantsAdmin from './pages/admin/RestaurantsAdmin.jsx';
import FoodsAdmin from './pages/admin/FoodsAdmin.jsx';
import UsersAdmin from './pages/admin/UsersAdmin.jsx';
import OrdersAdmin from './pages/admin/OrdersAdmin.jsx';
import { fetchCurrentUser } from './store/authSlice.js';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  return (
    <Routes>
      {/* Auth Routes - Separate Layout */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin/register" element={<AdminRegister />} />
      </Route>

      {/* Main Routes - With Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="restaurants" element={<Restaurants />} />
        <Route path="restaurants/:id" element={<RestaurantDetails />} />
        <Route path="food/:id" element={<FoodDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders/:id"
          element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          }
        />
        <Route path="search" element={<Search />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/restaurants" replace />} />
        <Route path="overview" element={<DashboardOverview />} />
        <Route path="restaurants" element={<RestaurantsAdmin />} />
        <Route path="foods" element={<FoodsAdmin />} />
        <Route path="users" element={<UsersAdmin />} />
        <Route path="orders" element={<OrdersAdmin />} />
      </Route>
    </Routes>
  );
}

export default App;
