import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import MainLayout from "./Layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";
import Settings from "./pages/Settings/Settings";
import Support from "./pages/Support/Support";
import Refunds from "./pages/Refunds/Refunds";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OrdersDetail from "./pages/Orders/OrdersDetail";
import AssignRider from "./pages/Orders/AssignRider";
import ChatSupport from "./pages/Support/ChatSupport";
import RefundsDetail from "./pages/Refunds/RefundsDetail";
import TwoFactor from "./components/TwoFactor";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProduct from "./pages/Products/EditProduct/EditProduct";
import ViewProduct from "./pages/Products/ViewProduct/ViewProduct";
import AddProduct from "./pages/Products/AddProduct";
import RequireStripeConnect from "./components/RequireStripeConnect";
import Returns from "./pages/Returns/Returns";
import ProductReturnDetail from "./pages/Returns/ProductReturnDetail";

const queryClient = new QueryClient();

const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/two-factor" element={<TwoFactor />} />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/refund" element={<Refunds />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/orders/ordersdetail/:id" element={<OrdersDetail />} />
            <Route path="/orders/assignrider/:id" element={<AssignRider />} />

            <Route path="/products/addproduct" element={<RequireStripeConnect><AddProduct /></RequireStripeConnect>} />
            <Route path="/products/editproduct/:id" element={<RequireStripeConnect><EditProduct /></RequireStripeConnect>} />
            <Route path="/products/viewproduct/:id" element={<ViewProduct />} />

            <Route
              path="/refund/refundsdetail/:id"
              element={<RefundsDetail />}
            />
            <Route
              path="/refund/Returnsdetail/:id"
              element={<ProductReturnDetail />}
            />

            <Route path="/support/chatsupport/:id" element={<ChatSupport />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
