import { createContext, useEffect, useState } from "react";


export let userContext = createContext();
export default function UserContextProvider(props){
    let [loggedin,setLoggedin]=useState(null);
    useEffect(()=>{
        let token=localStorage.getItem('token');
        if(token){
            setLoggedin(token);
        }      
    }
,[])
return(
    <userContext.Provider value={{loggedin,setLoggedin}}>
        {props.children}
    </userContext.Provider>
)
}