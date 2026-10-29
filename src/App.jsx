import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth/AuthContext';
import { CartProvider } from './context/cart/CartContext';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Catalog } from './components/Catalog';
import { ProductDetail } from './components/ProductDetail';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Cart } from './components/Cart';
import { Profile } from './components/Profile';
import { Comparator } from './components/Comparator';
import { Admin } from './components/Admin';

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col w-full">
      <Navbar />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={< Register />}></Route>
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/comparator" element={<Comparator />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;