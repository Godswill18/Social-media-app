import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import SignUp from './pages/auth/signup/SignUp'
import Login from './pages/auth/login/Login'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'

import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import { Toaster } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {
  const {data:authUser, isLoading} = useQuery({
    // This query fetches the authenticated user's data
    // It will be used to determine if the user is logged in or not
    queryKey: ["authUser"], // we use the querykey to give a unique name to our query and refer to it later
    queryFn: async() => {
      try{
        const res = await fetch("http://localhost:5000/api/auth/me",
          {
            method: "GET",
            credentials: "include", // Include cookies in the request to maintain session
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        const data = await res.json();
        if(data.error) return null; // If there's an error, return null to indicate no user is authenticated

        if(!res.ok){
          throw new Error(data.error || "Something went wrong");
        }
        // console.log( "auth user:",data);
        return data;
      }catch (error){
        console.error("Error fetching user data:", error);
        throw new Error(error);
      }
    },
    retry: false, // Retry once if the request fails
  });

  // console.log("Auth User:", authUser);


  if(isLoading){
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size='lg' />

      </div>
    )
  }

  return (
<div className='flex max-w-6xl mx-auto'>

  {authUser && <Sidebar/>}
  <Routes>
    <Route path='/' element={ authUser ? <Home/> : <Navigate to={'/login'} /> } />
    <Route path='/login' element={!authUser ? <Login/> : <Navigate to={'/'} /> } />
    <Route path='/signup' element={ !authUser ? <SignUp/> : <Navigate to={'/'} /> } />
    <Route path='/notifications' element={ authUser ? <NotificationPage/> : <Navigate to={'/login'} />} />
    <Route path='/profile/:username' element={ authUser ? <ProfilePage/> : <Navigate to={'/login'} />} />
  </Routes>
  {authUser && <RightPanel/>}
<Toaster richColors position="top-center"/>

</div>
  )
}

export default App
