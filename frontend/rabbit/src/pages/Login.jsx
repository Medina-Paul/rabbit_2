import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import login from "../../src/assets/login.webp";
import { loginUser } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { mergeCart } from "../../redux/slices/cartSlice";
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, userId: user._id })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex flex-col justify-center mb-6">
            <h2 className="text-xl text-center pb-4 font-medium">Rabbit</h2>
            <h2 className="text-2xl font-bold text-center mb-6">Hey there!</h2>
            <p className="text-center mb-6">
              Enter your username and password to login
            </p>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                className="w-full p-2 border rounded"
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                className="w-full p-2 border rounded"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Sign In
            </button>

            <p className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link
                to={`/register?redirect=${encodeURIComponent(redirect)}`}
                className="text-blue-500"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={login}
            alt="Login Image"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
