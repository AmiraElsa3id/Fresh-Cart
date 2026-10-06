import axios from "axios";
import { useFormik } from "formik";
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from'yup';


export default function ForgetPassword() {
    let navigate = useNavigate();
  let [msg,setMsg]= useState("")
  let [loading,setLoading]=useState(false);
    async function handelRegister(formData) {
        setLoading(true);
       await axios.post("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",formData)
        .then((response)=>{console.log("success",response);
          if (response.data.statusMsg === "success") {
          navigate("/verifyresetcode");
          setLoading(false);
        }
        })
        .catch((error)=>{
          setMsg(error.response.data.message)
          setLoading(false);
          console.log("error",error)});
      }
      let validationSchema=Yup.object({
        email:Yup.string().email("Invalid email address").required("Required"),
      });

      let formik = useFormik({
        initialValues: {
          email: "",
          
        },
        validationSchema,
        onSubmit: handelRegister
      });
  return (
    <> <div className="bg-gray-100 flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-md space-y-8">
        <div className="bg-white shadow-md rounded-md p-6">

           

            <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
                Forget Password
            </h2>
            {msg ?<div
                  className="bg-red-100 rounded-lg py-1 px-6 text-base text-red-700 mt-1 mb-3"
                  role="alert"
                >
                  {msg}
                </div>
               :null} 

            <form className="space-y-6" method="POST" onSubmit={formik.handleSubmit}>

              

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
                    <button type="submit"
                        className="flex w-full justify-center rounded-md border border-transparent bg-[#0D9488] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2">
                          {loading?<i className="fa fa-spinner fa-spin"></i>: "Send Code"}  
                        
                        </button>
                </div>
            </form>
        </div>
    </div>
</div>





</>
  )
}
