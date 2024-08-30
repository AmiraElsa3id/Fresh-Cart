import * as React from 'react';
import { useContext, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useFormik } from 'formik';
import  axios  from 'axios';
import  toast  from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import useMutationCart from './../../Hooks/useMutationCart';
import { onlinePayment ,cash} from './../../Apis/payment';
import { cartContext } from '../../Context/CartContext';

const style = {
  position: 'absolute' ,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#F0F3F2',
  // border: '2px solid #0D9488',
  borderRadius:"10px",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({cartId}) {
  let [flag,setflag]=useState(false)
  let [msg,setMsg]= useState("")
 let navigate= useNavigate()
  let [loading,setLoading]=useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let{clearCart}=useContext(cartContext)


async function removeCartProducts(){
 await clearCart()
}
  let{getProductToCart,setCartNum}=useContext(cartContext)
  let{mutate,data}=useMutationCart(onlinePayment)
  let{mutate:mutateCash,data:datacash}=useMutationCart(cash)
async function changeCart() {
  await getProductToCart();
}
 async function handleSubmit(shippingAddress) {
    if(flag){
      mutate({cartId,shippingAddress});
     
    }
    else{
      mutateCash({cartId,shippingAddress})
      navigate("/allorders")
    }
       if(data?.data?.status=='success'){
        window.location.href=data?.data?.session?.url
        await removeCartProducts();
        setflag(false);
      }
      navigate("/allorders")
  //  console.log(data?.data?.session?.url);
    
  }
  let formik = useFormik({
    initialValues: {
      details: "",
        phone: "",
        city: ""
     
    },
    // validationSchema,
    // validate: myValidation,
    onSubmit: handleSubmit
  });
 
  // async function handelRegister(formData) {
  //   setLoading(true);
  // //  await axios.put("https://ecommerce.routemisr.com/api/v1/auth/resetPassword",formData)
  // //   .then((response)=>{console.log("success",response)
  // //     if (response.data.token) {
    
  // //       toast.success("Password rest susseccfully",
  // //         {
  // //           duration: 4000,
  // //           position: 'top-center',}
  // //       );
  // //     Navigate("/login");
  // //     setLoading(false);
  // //   }
  // //   })
  // //   .catch((error)=>{
  // //     setMsg(error.response.data.message)
  // //     setLoading(false);
  // //     console.log("error",msg)});
  // }
  return (
    <div>
      <div className='flex gap-3'>

      <Button variant='contained' sx={{backgroundColor:"#0D9488",width:"9rem",padding:"0.75rem",borderRadius:".375rem",my:'5px',transition:"ease",transitionDuration:"200ms",}}  onClick={()=>{handleOpen();setflag(true);}}>Pay Online</Button>
      <Button variant='contained' sx={{backgroundColor:"#0D9488",width:"9rem",padding:"0.75rem",borderRadius:".375rem",my:'5px',transition:"ease",transitionDuration:"200ms",}}  onClick={()=>{handleOpen();}}>Pay Cash</Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <>
      <div className="bg-gray-100 flex  items-center justify-center px-4 sm:px-6 lg:px-8 ">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white shadow-md rounded-md p-6 ">
            {/* <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
              Reset Password
            </h2> */}
            {msg ?<div
                  className="bg-red-100 rounded-lg py-1 px-6 text-base text-red-700 mt-1 mb-3"
                  role="alert"
                >
                  {msg}
                </div>
               :null} 
            <form
              className="space-y-6"
              method="POST"
              onSubmit={formik.handleSubmit}
            >
             <div>
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details</label>
                    <div className="mt-1">
                        <input id='details' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.details} name="details" type="text" autoComplete="details" 
                            className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm" />
                    </div>
                    {formik.errors.details&& formik.touched.details ?<div
                  className="bg-red-100 rounded-lg py-1 px-6 text-base text-red-700 mt-1 mb-3"
                  role="alert"
                >
                  {formik.errors.details}
                </div>
               :null} 
                </div>
               
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <div className="mt-1">
                  <input
                    id="city"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.city}
                    name="city"
                    type="text"
                    
                    
                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                  />
                </div>
                {formik.errors.city&& formik.touched.city ?<div
                  className="bg-red-100 rounded-lg py-1 px-6 text-base text-red-700 mt-1 mb-3"
                  role="alert"
                >
                  {formik.errors.city}
                </div>
               :null} 
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    name="phone"
                    type="tel"
                    
                    
                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                  />
                </div>
                {formik.errors.phone&& formik.touched.phone ?<div
                  className="bg-red-100 rounded-lg py-1 px-6 text-base text-red-700 mt-1 mb-3"
                  role="alert"
                >
                  {formik.errors.phone}
                </div>
               :null} 
              </div>
              <div>
                <button
                  type="submit"
                  disabled={!(formik.isValid&&formik.dirty)}
                  className="flex w-full justify-center rounded-md border border-transparent bg-[#0D9488] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2 "
                >
                 {loading?<i className="fa fa-spinner fa-spin"></i>: "Submit"}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </>
        </Box>
      </Modal>
    </div>
  );
}
