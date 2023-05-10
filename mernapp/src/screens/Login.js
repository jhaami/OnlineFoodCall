import { useState } from "react"
import React from 'react'
import { Link,useNavigate} from 'react-router-dom'

export default function Login() {

  const [first, setfirst] = useState({ email: "", password: "" });
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/loginuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: first.email, password: first.password })

    });
    const json = await response.json();
    console.log(json);
    if (!json.success) {
      alert("enter valid crendantials")
    }

    if (json.success) {
      // alert("enter valid crendantials")
      localStorage.setItem("authToken",json.authToken);
      console.log(localStorage.getItem("authToken"));
      navigate("/");
    }
  }
  const onChange = (event) => {
    setfirst({ ...first, [event.target.name]: event.target.value })
  }
  return (
    <div>
      <div className='container'>
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input type="email" className="form-control" name='email' value={first.email} onChange={onChange} id="exampleInputEmail1" aria-describedby="emailHelp" />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" className="form-control" name='password' value={first.password} onChange={onChange} id="exampleInputPassword1" />
          </div>



          <button type="submit" className="btn btn-primary">Submit</button>
          <Link to="/creatuser" className='m-3 btn btn-danger'>I am new user</Link>
        </form>
      </div>
    </div>
  )
}
