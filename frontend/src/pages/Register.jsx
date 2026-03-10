import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/bg3.png";
import { registerUser } from "../services/auth";

const InputField = ({ type, name, placeholder, value, onChange }) => (
  <div className="relative mb-7 group">
    <input
      type={type}
      name={name}
      required
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-transparent border-b border-white/70 text-white placeholder-white/80 font-light py-2 outline-none focus:border-transparent font-jetbrains text-[15px]"
    />
    <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-white transition-all duration-300 group-focus-within:w-full" />
  </div>
);

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.detail || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative h-full w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/6" />

      <form
        onSubmit={handleSubmit}
        className="relative w-[400px] rounded-[2rem]  border-white/20 bg-transparent px-8 py-10"
      >
        <h2 className="text-white text-center text-5xl font-unicorn mb-2 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
          Create Account
        </h2>

        <p className="text-white text-center font-jetbrains text-sm mb-10 [text-shadow:0_2px_10px_rgba(0,0,0,0.75)]">
          Start tracing code like magic
        </p>

        {error ? (
          <p className="text-red-200 text-sm mb-5 text-center font-jetbrains [text-shadow:0_2px_8px_rgba(0,0,0,0.7)]">
            {error}
          </p>
        ) : null}

        <InputField
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />

        <InputField
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <InputField
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <InputField
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full text-white font-medium transition-all duration-300 active:scale-95 bg-transparent  border-white/70 hover:bg-white/10 font-jetbrains"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-white text-sm hover:underline font-jetbrains [text-shadow:0_2px_8px_rgba(0,0,0,0.7)]"
          >
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;