import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate()

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {name,password,email,});
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Welcome! Account created successfully!");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {password,email,});
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if (token) {
      navigate('/')
    }
  },[token])

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center justify-center py-10">
      <div className="flex flex-col gap-4 items-start p-10 min-w-[340px] sm:min-w-[420px] border border-gray-100 rounded-3xl text-gray-700 text-sm shadow-2xl bg-white animate-fadeIn">
        <div className="w-full text-center mb-2">
          <p className="text-3xl font-bold text-gray-700">
            {state === "Sign Up" ? "Create Account" : "Welcome Back"}
          </p>
          <p className="text-gray-600 mt-2">
            Please {state === "Sign Up" ? "sign up" : "login"} to book an appointment
          </p>
        </div>
        
        {state === "Sign Up" && (
          <div className="w-full">
            <label className="font-semibold text-gray-700 uppercase tracking-wider text-xs">Full Name</label>
            <input
              className="border border-gray-200 rounded-xl w-full p-3 mt-1.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-gray-50/50"
              type="text"
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}
        
        <div className="w-full">
          <label className="font-semibold text-gray-700 uppercase tracking-wider text-xs">Email</label>
          <input
            className="border border-gray-200 rounded-xl w-full p-3 mt-1.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-gray-50/50"
            type="email"
            placeholder="johndoe@example.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        
        <div className="w-full">
          <label className="font-semibold text-gray-700 uppercase tracking-wider text-xs">Password</label>
          <div className="relative w-full">
            <input
              className="border border-gray-200 rounded-xl w-full p-3 mt-1.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-gray-50/50"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <div 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 translate-y-[10%] cursor-pointer text-gray-400 hover:text-blue-600 transition-colors"
            >
              <span className="text-[10px] font-bold tracking-widest uppercase">{showPassword ? "Hide" : "Show"}</span>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-600 text-white w-full py-4 rounded-xl text-base font-bold mt-4 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          {state === "Sign Up" ? "CREATE ACCOUNT" : "LOGIN"}
        </button>
        
        <div className="w-full text-center mt-4">
          {state === "Sign Up" ? (
            <p className="text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-blue-600 font-bold hover:underline cursor-pointer transition-all ml-1"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-gray-600">
              Create a new account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-600 font-bold hover:underline cursor-pointer transition-all ml-1"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};
export default Login;
