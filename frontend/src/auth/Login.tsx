import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormInput from "../components/FormInput";
import FormSubmitButton from "../components/FormSubmitButton";
import FormFooter from "../components/FormFooter";
import RememberMe from "../components/RememberMe";
import { setUser, getUser } from "../lib/auth";
import { request } from "../api";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate();

  if (getUser()) {
    navigate("/home", { replace: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isDisabled) return;
    setIsDisabled(true);

    const { data } = await request<{
      success: boolean;
      message: string;
      name: string;
      _id: string;
      email: string;
      hasFace: boolean;
    }>("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }, false);

    setIsDisabled(false);
    if (data && data.success) {
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        hasFace: data.hasFace,
      });
      toast.success(`Welcome back, ${data.name}!`);
      navigate("/home");
    } else if (data && !data.success) {
      toast.error(data.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-600 flex justify-center items-center">
            <div className="size-7">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            SafeVault
          </div>
          <p className="text-gray-500 mt-1 text-sm">
            Welcome back. Please login to your vault.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <FormInput
            htmlFor="email"
            label="Email"
            type="text"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <FormInput
            htmlFor="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            showPassword={showPassword}
            onClick={() => setShowPassword(!showPassword)}
          />

          <RememberMe
            value={formData.remember}
            onChange={(e) =>
              setFormData({ ...formData, remember: e.target.checked })
            }
          />

          <FormSubmitButton isDisabled={isDisabled} text="Log in" />
        </form>
        <FormFooter text="Sign up" href="/signup" />
      </div>
    </div>
  );
}