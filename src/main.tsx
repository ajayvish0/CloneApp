// import React from 'react'; these are not longer we need
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom'
import App from './App';
import './globals.css'
import AuthProvider from './context/AuthContext';
import QueryProvider from './lib/react-query/QueryProvider';

ReactDOM.createRoot(document.getElementById("root")!).render(   // ! == for typescript not complained

   <BrowserRouter>
    <QueryProvider>
        <AuthProvider>
            <App/>
 
        </AuthProvider>

    </QueryProvider> 
       
   </BrowserRouter>
)