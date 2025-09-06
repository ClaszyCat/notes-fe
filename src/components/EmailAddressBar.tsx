"use client";
import React, { useState } from "react";

interface EmailAddressBarProps {
  email: string;
  setEmail: (email: string) => void;
}

const EmailAddressBar: React.FC<EmailAddressBarProps> = ({
  email,
  setEmail,
}) => {
  const isValid = email.includes("@");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  return (
    <input
      type="email"
      value={email}
      onChange={handleChange}
      placeholder="you@example.com"
      style={{
        borderColor: isValid ? "green" : "black",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "32px",
        padding: "0.5rem 1rem",
        outline: "none",
        fontSize: "1rem",
        width: "100%",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
      }}
    />
  );
};

export default EmailAddressBar;
