import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType , IUser } from "@/types";
import {createContext, useContext, useEffect, useState} from 'react';
  
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {  // empty user 
    
    id : '',
    name : '',
    username : '',
    email : '',
    imageUrl : '',
    bio : ''

     
};
 

const INITIAL_STATE = {  // to know we have an logged in user all time 
    user : INITIAL_USER,
    isLoading : false , 
    isAuthenticated : false , 
    setUser : () => {},  // set the authenticated user 
    setIsAuthenticated : () => {},
    checkAuthUser : async () => false as boolean,
}

const AuthContext  = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({children} : {children : React.ReactNode}) => {

  const [user , setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  
  const checkAuthUser =async () => {
    try {
        const currentAccount = await getCurrentUser();
        if(currentAccount ){
            setUser({
                id : currentAccount.$id,
                name : currentAccount.name ,
                username: currentAccount.username,
                email : currentAccount.email,
                imageUrl: currentAccount.imageUrl,
                bio: currentAccount.bio
            })
            setIsAuthenticated(true);
            return true;
        }
        return false;
        
    } catch (error) {
        console.log(error);
        return false ;
    }finally {
        setIsLoading(false);
    }
  };  // this is call whenever we reload the page,for that we use (useEffect)

    useEffect( () => {
      if(
        localStorage.getItem('cookieFallback')==='[]'  ||  //navigate the user back to sign in page
        localStorage.getItem('cookieFallback') ===null
        ) 
       navigate('/sign-in')

      checkAuthUser();  //whenever we reload the page, we recall this function
    },[]);
  



  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser
  }


  return ( 
    <AuthContext.Provider value = {value}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);