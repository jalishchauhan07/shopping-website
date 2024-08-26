import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Login from "./components/admin/login/login";
import Register from "./components/admin/register/register";
import ForgetPassword from "./components/admin/forgetPassword/forgetPassword";
import ChangePassword from "./components/admin/changePassword/changePassword";
import NotFound from "./components/404";
import AddProduct from "./components/product/addProduct/addProduct";
import ProductList from "./components/product/productList/productList";
import AdminDashboard from "./components/admin/dashboard/dashboard";
import ProfilePage from "./components/admin/profile/profile";
import UpdatePassword from "./components/admin/updatePassword/updatePassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<Dashboard />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/forgetPassword" element={<ForgetPassword />}></Route>
        <Route path="/changePassword" element={<ChangePassword />}></Route>
        <Route path="/product/addProduct" element={<AddProduct />}></Route>
        <Route path="/product/" element={<ProductList />}></Route>
        <Route path="/admin/" element={<AdminDashboard />}></Route>
        <Route path="/admin/profile" element={<ProfilePage />}></Route>
        <Route
          path="/admin/updatePassword"
          element={<UpdatePassword />}
        ></Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
