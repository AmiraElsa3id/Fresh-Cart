import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from'yup';
import { userContext } from "../../Context/UserContext";
export default function Register() {
  let {setLoggedin}=useContext(userContext);
  let navigate = useNavigate();
  let [msg,setMsg]= useState("")
  let [loading,setLoading]=useState(false);
  async function handelRegister(formData) {
    // console.log(formData);
    // console.log(formik);
    // let { data } = await axios.post(
    //   "https://ecommerce.routemisr.com/api/v1/auth/signup",
    //   formData
    // );
    // console.log(data.message);
    // if (data.message == "success") {
    //   navigate("/login");
    // } else {
    //   setMsg(data.message)
    //   alert("error",msg);
    // }
    setLoading(true);
   await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signup",formData)
    .then((response)=>{console.log("success",response)
      if (response.data.message == "success") {
        localStorage.setItem('token',response.data.token)
            setLoggedin(response.data.token)
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
    name:Yup.string().required("Required").min(3,"minimum number of characters is 3").max(10,"maximum number of characters is 10"),
    email:Yup.string().email("Invalid email address").required("Required"),
    phone:Yup.string().required("Required").matches(/^01[1250][0-9]{8}/i,'Invalid Phone Number'),
    password:Yup.string().required("Required").matches(/^[A-Z][a-z0-9]{6,8}/,'Password must start with a capital letter and at least 6 small letters and numbers'),
    rePassword:Yup.string().required("Required").oneOf([Yup.ref('password')],"no Match")


  })
  // custom validation
  // function myValidation(values) {
    
  //   let errors = {};
  //   if (!values.name) {
  //     errors.name = "Required";
  //   } else if (!/^[A-Z][a-z]{3,5}$/.test(values.name)) {
  //     errors.name =
  //       "Name must start with a capital letter and at least 3 small letters";
  //   }
  //   if (!values.email) {
  //     errors.email = "Required";
  //   } else if (
  //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  //   ) {
  //     errors.email = "Invalid email address";
  //   }
  //   if (!values.phone) {
  //     errors.phone = "Required";
  //   } else if (!/^01[1250][0-9]{8}/i.test(values.phone)) {
  //     errors.phone = "Invalid phone number";
  //   }
  //   if (!values.password) {
  //     errors.password = "Required";
  //   } else if (!/^[A-Z][a-z0-9]{6,8}/.test(values.password)) {
  //     errors.password =
  //       "Password must start with a capital letter and at least 6 small letters and numbers";
  //   }
  //   if (!values.rePassword) {
  //     errors.rePassword = "Required";
  //   } else if (values.password !== values.rePassword) {
  //     errors.rePassword = "Password does not match";
  //   }
  //   return errors
  // }

  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
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
              Sign up
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
                <label
                  htmlFor="u-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="u-name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    name="name"
                    type="text"
                    
                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                  />
                </div>
               {formik.errors.name&& formik.touched.name ?<div
                  className="bg-red-100 rounded-lg py-1 px-6 text-base text-red-700 mt-1 mb-3"
                  role="alert"
                >
                  {formik.errors.name}
                </div>
               :null} 
              </div>

              <div>
                <label
                  htmlFor="u-email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="u-email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    name="email"
                    type="email"
                    autoComplete="email-address"
                    
                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                  />
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
                  htmlFor="u-phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <div className="mt-1">
                  <input
                    id="u-phone"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    name="phone"
                    type="tel"
                    autoComplete="phone"
                    
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
                <label
                  htmlFor="u-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="upassword"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    name="password"
                    type="password"
                    autoComplete="password"
                    
                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                  />
                </div>
                {formik.errors.password&& formik.touched.password ?<div
                  className="bg-red-100 rounded-lg py-1 px-6 text-base text-red-700 mt-1 mb-3"
                  role="alert"
                >
                  {formik.errors.password}
                </div>
               :null} 
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.rePassword}
                    name="rePassword"
                    type="password"
                    autoComplete="confirm-password"
                    
                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#0D9488] focus:outline-none focus:ring-[#0D9488] sm:text-sm"
                  />
                </div>
                {formik.errors.rePassword&& formik.touched.rePassword ?<div
                  className="bg-red-100 rounded-lg py-1 px-6 text-base text-red-700 mt-1 mb-3"
                  role="alert"
                >
                  {formik.errors.rePassword}
                </div>
               :null} 
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!(formik.isValid&&formik.dirty)}
                  className="flex w-full justify-center rounded-md border border-transparent bg-[#0D9488] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2 "
                >
                 {loading?<i className="fa fa-spinner fa-spin"></i>: "Register"}
                </button>
              </div>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link to={'/login'}
                  className="font-medium text-[#0D9488] hover:underline dark:text-[#0D9488] cursor-pointer"
                  href="/signin"
                >
                  Sign in here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
