import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import {auth} from '../firebase'

export const AuthContext = createContext()
export const AuthContextProvider =({children}) =>{
    const [currentUser, setCurrentUser] = useState({})

    useEffect(()=> {
     const unsub = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        console.log(user)
      });

      return() => {
        unsub();
      }
    },[]);

    return(

    <AuthContext.Provider value={{currentUser}}>
        {/* This children represents the components */}
    {children}
    </AuthContext.Provider>
    )
}