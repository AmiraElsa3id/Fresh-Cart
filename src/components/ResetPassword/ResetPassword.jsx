import axios from "axios";
import { useFormik } from "formik";
import  {  useState } from "react";
import toast from "react-hot-toast";
import {  useNavigate } from "react-router-dom";
import * as Yup from'yup';


export default function ResetPassword() {
 
  let navigate = useNavigate();
  let [msg,setMsg]= useState("")
  let [loading,setLoading]=useState(false);
  async function handelRegister(formData) {
    setLoading(true);
   await axios.put("https://ecommerce.routemisr.com/api/v1/auth/resetPassword",formData)
    .then((response)=>{console.log("success",response)
      if (response.data.token) {
    
        toast.success("Password rest susseccfully",
          {
            duration: 4000,
            position: 'top-center',}
        );
      navigate("/login");
      setLoading(false);
    }
    })
    .catch((error)=>{
      setMsg(error.response.data.message)
      setLoading(false);
      console.log("error",msg)});
  }
  let validationSchema=Yup.object({
    email:Yup.string().email("Invalid email address").required("Required"),
    newPassword:Yup.string().required("Required").matches(/^[A-Z][a-z0-9]{6,8}/,'Password must start with a capital letter and at least 6 small letters and numbers'),
   


  })
  
  let formik = useFormik({
    initialValues: {
      email:"",
      newPassword: "",
     
    },
    validationSchema,
    // validate: myValidation,
    onSubmit: handelRegister
  });
  return (
    <>
      <div className="bg-gray-100 flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8 ">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white shadow-md rounded-md p-6 ">
            <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
              Reset Password
            </h2>
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
                    <label htmlFor="u-email" className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1">
                        <input id='u-email' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} name="email" type="email" autoComplete="email-address" 
                            className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm" />
                    </div>
                    {formik.errors.email&& formik.touched.email ?<div
                  className="bg-red-100 rounded-lg py-1 px-6 text-base text-red-700 mt-1 mb-3"
                  role="alert"
                >
                  {formik.errors.email}
                </div>
               :null} 
                </div>
               
              <div>
                <label
                  htmlFor="u-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="upassword"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.newPassword}
                    name="newPassword"
                    type="password"
                    
                    
                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                  />
                </div>
                {formik.errors.newPassword&& formik.touched.newPassword ?<div
                  className="bg-red-100 rounded-lg py-1 px-6 text-base text-red-700 mt-1 mb-3"
                  role="alert"
                >
                  {formik.errors.newPassword}
                </div>
               :null} 
              </div>
              <div>
                <button
                  type="submit"
                  disabled={!(formik.isValid&&formik.dirty)}
                  className="flex w-full justify-center rounded-md border border-transparent bg-[#0D9488] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2 "
                >
                 {loading?<i className="fa fa-spinner fa-spin"></i>: "Reset"}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
