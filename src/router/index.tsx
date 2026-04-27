import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PageNotFound from "../pages/PageNotFound";
import Layout from "../pages/Layout";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import Profile from "../pages/Profile";
import Brands from "../pages/Brands";
import CookieService from "../services/cookies";

// Fetch token dynamically inside the router components or via a hook if possible,
// but for the static router definition, we can use a helper or check state.
const isAuthenticated = () => !!CookieService.get("jwt");

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="brands" element={<Brands />} />
        <Route path="product/:id" element={<ProductDetails />} />
        
        {/* Auth Routes - Redirect if already logged in */}
        <Route 
          path="login" 
          element={
            isAuthenticated() ? <Navigate to="/" replace /> : <Login />
          } 
        />
        <Route 
          path="register" 
          element={
            isAuthenticated() ? <Navigate to="/" replace /> : <Register />
          } 
        />

        {/* Protected Routes */}
        <Route
          path="cart"
          element={
            <ProtectedRoute
              isAllowed={isAuthenticated()}
              redirectPath="/login"
            >
              <Cart />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="checkout"
          element={
            <ProtectedRoute
              isAllowed={isAuthenticated()}
              redirectPath="/login"
            >
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders"
          element={
            <ProtectedRoute
              isAllowed={isAuthenticated()}
              redirectPath="/login"
            >
              <Orders />
            </ProtectedRoute>
          }
        />
        
        {/* Profile */}
        <Route
          path="profile"
          element={
            <ProtectedRoute
              isAllowed={isAuthenticated()}
              redirectPath="/login"
            >
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<PageNotFound />} />
    </>,
  ),
);

export default router;
