import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Cookie from 'js-cookie'

const ProtectRoute = () => {
    const jwtToken = Cookie.get('jwtToken')
    return jwtToken ? <Outlet /> : <Navigate to='/' />

}

export default ProtectRoute