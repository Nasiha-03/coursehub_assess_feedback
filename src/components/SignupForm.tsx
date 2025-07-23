import React, { useState } from "react";
import "./SignupForm.css"; // style this separately

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const alreadyExists = existingUsers.some(
      (user: any) => user.email === formData.email
    );

    if (alreadyExists) {
      alert("User with this email already exists.");
      return;
    }

    const newUser = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Account created successfully!");

    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p>Join us to track your progress</p>

        <input
          type="text"
          name="name"
          placeholder=" Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder=" Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder=" Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder=" Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Account</button>

        <p>
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
