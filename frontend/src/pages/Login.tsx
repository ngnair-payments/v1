import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

const initialData = {
  email: "",
  password: "",
};

export default function Login() {
  const { setToken } = useAuth();
  const [formData, setFormData] = useState(initialData);
  const navigate = useNavigate();
  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    (async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/auth/generateToken`,
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((ok) => ok.text());

      const validToken = await fetch(
        `${import.meta.env.VITE_API_URI}/auth/validateToken`,
        {
          headers: {
            Authorization: `Bearer ${response}`,
          },
        }
      ).then(async (ok) => ok.text());

      if (validToken === "ok") {
        setToken(response);
        navigate("/", { replace: true });
      } else {
        setToken(null);
        // let user know
      }
    })();
  };
  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-md">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow"
          >
            Submit
          </button>
          <a href="/signup">Register</a>
        </div>
      </form>
    </div>
  );
}
