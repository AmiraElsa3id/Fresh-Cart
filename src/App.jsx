
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout';
import Login from './Components/Login/Login';
import Brands from './Components/Brands/Brands';
import Carts from './Components/Carts/Carts';
import Notfound from './Components/Notfound/Notfound';
import UserContextProvider from './Context/UserContext';
import CartContextProvider from './Context/CartContext';
import Register from './Components/Register/Register';
import ProtectRoute from './Components/ProtectRoute/ProtectRoute';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import Products from './Components/Products/Products';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import VerifyResetCode from './Components/VerifyResetCode/VerifyResetCode';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import { Toaster } from 'react-hot-toast';
import Home from './Components/Home/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import CategoryPage from './Components/CategoryPage/CategoryPage';

import  WishListContextProvider  from './Context/WishListContext';
import WishList from './Components/WishList/WishList';

Notfound
function App() {
let routes= createBrowserRouter([
  {path:'',element:<Layout></Layout>,children:[
    {index:true,element:<ProtectRoute><Products></Products></ProtectRoute>},
    {path:'/brands',element:<ProtectRoute><Brands></Brands></ProtectRoute>},
    {path:'/products',element:<ProtectRoute><Home></Home></ProtectRoute>},
    {path:'/category',element:<ProtectRoute><CategoryPage></CategoryPage></ProtectRoute>},
    {path:'/wishlist',element:<ProtectRoute><WishList></WishList></ProtectRoute>},
    {path:'/cart',element:<ProtectRoute><Carts></Carts></ProtectRoute>},
    {path:'/product-details/:id/:category',element:<ProtectRoute><ProductDetails></ProductDetails></ProtectRoute>},
    {path:'/register',element:<Register></Register>},
    {path:'/login',element:<Login></Login>},
    {path:'/forgetpassword',element:<ForgetPassword></ForgetPassword>},
    {path:'/verifyresetcode',element:<VerifyResetCode></VerifyResetCode>},
    {path:'/resetpassword',element:<ResetPassword></ResetPassword>},
    {path:'*',element:<Notfound></Notfound>},
    
  ]}
])

QueryClient
const queryClient = new QueryClient({defaultOptions:{queries:{refetchOnWindowFocus:false}}})

  return (
    <>
    <QueryClientProvider  client={queryClient}>
<WishListContextProvider>
      <CartContextProvider>
<UserContextProvider>

      <RouterProvider router={routes}></RouterProvider>
      <Toaster/>
    
   </UserContextProvider>
</CartContextProvider>
   </WishListContextProvider>
    </QueryClientProvider>

   
    </>
  )
}

export default App
