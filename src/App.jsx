import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ToastConfig from "./components/ToastConfig"; 
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import MainLayout from "./layouts/MainLayout";
import ProfileLayout from "./layouts/ProfileSideBarLayout";

import {
  Home, Store, ProductDetail, Login, SignUp,
  Cart, Checkout, Payment, ProfileInfoPage,
  AddressPage, OrdersPage, OrderSuccessPage
} from "./pages/user/index";
import VerifyOTP from "./pages/auth/VerifyOtpPage";
import Unauthorized from "./pages/error/Unauthorized"; 

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminOrders from "./pages/admin/AdminOrders"; 
import AdminTransactionHistory from "./pages/admin/AdminTransactionHistroy"; 

// IMPORT KOMPONEN OWNER
import DashboardOwner from "./pages/owner/DashboardOwner"; 
import ProfilOwner from "./pages/owner/Profil"; 
import AnalisisKeuangan from "./pages/owner/AnalisisKeuangan"; 
import AnalisisProduk from "./pages/owner/AnalisisProduk"; 
import RiwayatTransaksi from "./pages/owner/RiwayatTransaksi";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <ToastConfig />

          <Routes>
            {/* Rute Umum (Public Routes) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/store" element={<Store />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />

              {/* Rute Campuran Terproteksi (User, Admin, Owner) */}
              <Route element={<ProtectedRoute allowedRoles={["user", "admin", "owner"]} />}> 
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-success" element={<OrderSuccessPage />} /> 
                <Route path="/profile" element={<ProfileLayout />}>
                  <Route index element={<ProfileInfoPage />} />
                  <Route path="address" element={<AddressPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                </Route>
              </Route>
            </Route>

            {/* Rute Otentikasi */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* Rute Khusus Admin */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/inventory" element={<AdminInventory />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/transactions" element={<AdminTransactionHistory />} />
            </Route>

            {/* RUTE KHUSUS OWNER (DIAMANKAN DENGAN PROTECTED ROUTE) */}
            <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
              <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />
              <Route path="/owner/dashboard" element={<DashboardOwner />} />
              <Route path="/owner/profil" element={<ProfilOwner />} />
              <Route path="/owner/analisis" element={<AnalisisKeuangan />} />
              <Route path="/owner/rekap" element={<AnalisisProduk />} /> 
              <Route path="/owner/riwayat" element={<RiwayatTransaksi />} />
            </Route>

            {/* Rute Error & Fallback */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;