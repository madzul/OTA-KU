import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function FirstRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Email validation using regex
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation (min 8 chars)
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  // Handle input changes and validate in real-time
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors({ ...errors, email: !!value && !validateEmail(value) });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setErrors({
      ...errors,
      password: !!value && !validatePassword(value),
      confirmPassword: !!confirmPassword && value !== confirmPassword,
    });
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors({ ...errors, confirmPassword: !!value && value !== password });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Final validation before submission
    const newErrors = {
      email: !validateEmail(email),
      password: !validatePassword(password),
      confirmPassword: password !== confirmPassword,
    };

    setErrors(newErrors);

    // If no errors, proceed with form submission
    if (!Object.values(newErrors).some((error) => error)) {
      // Submit form data
      console.log("Form submitted:", { email, password });
    }
  };

  return (
    <div className="flex flex-col items-center gap-9">
      <img
        src="/icon/logo-basic.png"
        alt="logo"
        className="mx-auto h-[81px] w-[123px]"
      />
      <h1 className="text-primary text-center text-3xl font-bold md:text-[50px]">
        Daftar Sebagai Mahasiswa
      </h1>
      <h2 className="text-primary text-center text-2xl md:text-[26px]">
        Silahkan isi kolom yang tersedia
      </h2>
      <section className="md:w-[400px]">
        <form
          onSubmit={handleSubmit}
          className="flex w-[100%] flex-col gap-[20px]"
        >
          {/* Email */}
          <div>
            <label htmlFor="email" className="text-primary text-sm">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={handleEmailChange}
            />
            {errors.email && (
              <span className="text-destructive text-sm">
                Masukkan format email yang benar
              </span>
            )}
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="text-dark text-base">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={handlePasswordChange}
            />
            {errors.password && (
              <span className="text-destructive text-sm">
                Password minimal 8 karakter
              </span>
            )}
          </div>
          {/* Konfirmasi Password */}
          <div>
            <label htmlFor="confirmPassword" className="text-dark text-base">
              Konfirmasi Kata Sandi
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Kata Sandi"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {errors.confirmPassword && (
              <span className="text-destructive text-sm">
                Kata sandi tidak cocok
              </span>
            )}
          </div>
          <Button type="submit" className="w-full">
            Masuk
          </Button>
          <Button type="button" className="w-full" variant={"secondary"}>
            Kembali
          </Button>
        </form>
      </section>
    </div>
  );
}
