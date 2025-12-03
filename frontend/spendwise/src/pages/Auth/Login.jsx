import React from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useState } from "react";
import { useNavigate,Link } from 'react-router-dom';
import Input from '../../components/Input/Input';
import { validateEmail } from '../../utils/helper';
const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [error, setError] = useState(null);
const navigate=useNavigate();

async function handleLogin(e){

  e.preventDefault()

  if (!validateEmail(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (password.length < 8) {
    setError("Password must be at least 8 characters long.");
    return;
  }

  setError(null); // Clear any previous errors



}

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black '
        >Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'
        >Please enter your details to log in</p>

        <form onSubmit={handleLogin}>
          <Input
          label="Email Address"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
          label="Password"
              placeholder="Min 8 characters"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
            
            <button type="submit" className='btn-primary'>LOGIN</button>

            <p className='text-[13px] text-slate-800 mt-3'>Don't have an account?{' '}
              <Link className="font-medium text-primary underline" to="/signup">Sign Up</Link>
            </p>

        </form>


      </div>
    </AuthLayout>
  )
}

export default Login
