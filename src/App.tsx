import { Routes, Route } from 'react-router-dom'; 

import SigninForm from './_auth/Forms/SigninForm';
import SignupForm from './_auth/Forms/SignupForm';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from "@/components/ui/toaster" 
 

const App = () => {
  return (
    // <div>App</div>
   <main className='flex h-screen  '>
     
     <Routes> 
         {/*Public route */}
         <Route element={<AuthLayout  />}>
          <Route path='/sign-in' element = {<SigninForm />} /> 
          <Route path='/sign-up' element= {<SignupForm />} /> 
         </Route>
      

        {/*private Route */}
        
        <Route element={<RootLayout/>}>
          <Route index element={<Home/>}  /> 
          <Route path='/explore' element={<Explore/>} />
          <Route path='/saved' element={<Saved/>} />
          <Route path='/all-users' element={<AllUsers/>} />
          <Route path='/create-post' element={<CreatePost/>} />
          <Route path='/update-post/:id' element={<EditPost/>} />
          <Route path='/posts/:id' element={<PostDetails/>} />
          <Route path='/profile/:id/*' element={<Profile/>} />  // shows everything after the profile is going to point the profile
          <Route path='/update-profile' element={<UpdateProfile/>} />
         
        </Route>

     </Routes>

     <Toaster />
   </main>
  )
}

export default App;