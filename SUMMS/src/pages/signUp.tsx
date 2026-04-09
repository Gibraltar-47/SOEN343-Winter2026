import { useState } from "react";
import imgLogo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { registerClient } from "../services/userService";

type SignUpProps = {
  onLogin?: () => void;
  onSignUp?: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => void;
};

function InputField({
  type,
  placeholder,
  value,
  onChange,
}: {
  type: "text" | "email" | "password";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        h-12 w-full rounded-full border-2 border-[#cfcfcf] bg-white/95
        px-4 text-sm text-gray-700 outline-none transition
        placeholder:text-gray-400
        focus:border-[#76c573] focus:ring-2 focus:ring-[#76c573]/30
      "
    />
  );
}

export default function SignUp({ onLogin, onSignUp }: SignUpProps) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
      return;
    }

    navigate("/");
  };

  const handleSignUp = () => {
    if (!firstName || !lastName || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (onSignUp) {
      onSignUp(firstName, lastName, email, password);
      return;
    }

    const result = registerClient(
      firstName,
      lastName,
      email,
      password,
      "provider"
    );

    alert(result.message);

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3] overflow-hidden">
      <div className="flex min-h-screen flex-col">
        <header className="flex h-[72px] items-center justify-end bg-[#76c573] px-4 shadow-[0px_4px_25px_rgba(0,0,0,0.18)] sm:px-6">
          <div className="flex items-center gap-3">
          </div>
        </header>

        <main className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <img
            src={imgLogo}
            alt="SUMMS logo background"
            className="
              pointer-events-none absolute left-1/2 top-1/2
              w-[700px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2
              opacity-45 sm:w-[820px] lg:w-[950px]
            "
          />

          <div
            className="
              relative z-10 w-full max-w-[420px] rounded-[38px] border-2 border-white/80
              bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(234,234,234,0.49)_42.6%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)]
              p-6 shadow-[0px_4px_57px_rgba(0,0,0,0.14)] backdrop-blur-[6px]
              sm:p-8
            "
          >
            <h1 className="mb-6 text-center text-[32px] font-medium text-[#297525]">
              Sign Up
            </h1>

            <div className="space-y-4">
              <InputField
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={setFirstName}
              />

              <InputField
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={setLastName}
              />

              <InputField
                type="email"
                placeholder="Email"
                value={email}
                onChange={setEmail}
              />

              <InputField
                type="password"
                placeholder="Password"
                value={password}
                onChange={setPassword}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleSignUp}
                className="
                  h-12 w-full max-w-[420px] rounded-full bg-[#1fae19] px-6
                  text-sm font-semibold text-white transition hover:bg-green-700
                "
              >
                Sign Up
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleLogin}
                className="
                  h-9 min-w-[140px] rounded-full bg-[#41a7ff] px-6
                  text-sm font-semibold text-white transition hover:bg-blue-600
                "
              >
                Log In
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}