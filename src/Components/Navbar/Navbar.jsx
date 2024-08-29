import  { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { userContext } from "../../Context/UserContext";

export default function Navbar() {
  let{loggedin,setLoggedin}=useContext(userContext);
  let navigate=useNavigate();
  function logOut(){
    setLoggedin(null);
    localStorage.removeItem('token');
    navigate("/login")
    
  }
  return (
    <>
      <header className="bg-[#F0F3F2] shadow-md z-[999] fixed top-0 w-full">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-1 md:flex md:items-center md:gap-12">
              <NavLink className="block text-teal-600" href="#">
                <span className="sr-only">Home</span>
                <i className="fa-solid fa-cart-shopping fa-2xl"></i>
                <span className="ml-2 text-lg font-bold text-gray-700 logo" >Fresh Cart </span>
              </NavLink>
            </div>

            <div className="md:flex md:items-center md:gap-12">
              {loggedin? <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center gap-6 text-sm">
                  <li>
                    <NavLink
                      to={""}
                      className="text-gray-500 transition hover:text-gray-500/75"
                     
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={"brands"}
                      className="text-gray-500 transition hover:text-gray-500/75"
                      
                    >                     
                      Brands
                    </NavLink>
                  </li>
 <li>
                    <NavLink
                      to={"products"}
                      className="text-gray-500 transition hover:text-gray-500/75"
                      
                    >                     
                      Products
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={"category"}
                      className="text-gray-500 transition hover:text-gray-500/75"
                      
                    >                     
                      Categories
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={"cart"}
                      className="text-gray-500 transition hover:text-gray-500/75"
                      
                    >                     
                      Cart
                    </NavLink>
                  </li>
                 
                </ul>
              </nav>
             
              :null}
             
{!(loggedin)? <div className="flex items-center gap-4">
                <div className="sm:flex sm:gap-4">
                  <NavLink
                  to={'/login'}
                    className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow"
                  
                  >
                    Login
                  </NavLink>
                  <div className="hidden sm:flex gap-x-2 md:items-center">
                    <NavLink
                      to={"register"}
                      className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600"
                     
                    >
                      Register
                    </NavLink>
                    <ul className="flex gap-x-2 text-[#0D9488]">
                      <li>
                        <i className="fab fa-facebook"></i>
                      </li>
                      <li>
                        <i className="fab fa-youtube"></i>
                      </li>
                      <li>
                        <i className="fab fa-instagram"></i>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="block md:hidden">
                  <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
:
 
              <NavLink
              className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow"
              onClick={logOut}
              to={'/login'}
            >
              LogOut
            </NavLink>
}
             
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
