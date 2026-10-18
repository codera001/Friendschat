import { React, useState } from 'react';
import './style.scss'
import { useNavigate , Link} from "react-router-dom";
import {  signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from 'firebase/auth';

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(e.target[0].value)
    const email = e.target[0].value;
    const password = e.target[1].value;


    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch (err) {
      setErr(true);
    }
   
  }; 
  return (
    <div className='formContainer'> 
        <div className='formWrapper'>
            <span className='logo'>Friends chat</span>
            <span className='title'>Sign In</span>
           <form onSubmit={handleSubmit}> 
            <input type="email" placeholder='email'/>
            <input type="password"  placeholder='password'/>
            <input type="file" id='file' style={{display:"none"}}/>
            <button>Sign in</button>
            {err && <span>Something went wrong</span>}
            <p>You don't have an account? <Link to = "/register" >Register</Link> </p>
           </form>
        </div>
    </div>
  )
}

export default Login