"use client";

import React, { ReactNode, MouseEvent, ButtonHTMLAttributes } from "react";
import { logout } from "../logout/actions";
import { FaShare, FaEdit, FaSignOutAlt } from "react-icons/fa";

// Define variant types for type safety
type ButtonVariant = "default" | "primary" | "danger";

// Define props interface with proper types
interface ActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  icon?: ReactNode;
  children: ReactNode;
}

// Button component using modern ES6 approach
const ActionButton = ({ 
  onClick, 
  type = "button", 
  variant = "default", 
  icon, 
  children,
  ...props
}: ActionButtonProps) => {
  // Define style variants
  const variants: Record<ButtonVariant, string> = {
    default: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    primary: "bg-[var(--primary-color)] bg-opacity-10 hover:bg-opacity-20 text-[var(--primary-color)]",
    danger: "bg-red-100 hover:bg-red-200 text-red-600"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 ${variants[variant]}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

export default function ProfileActions() {
  return (
    <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
      
      <ActionButton 
        variant="default"
        onClick={() => {
          const editButton = document.getElementById('edit-profile-btn');
          if (editButton) editButton.click();
        }}
        icon={<FaEdit size={14} />}
      >
        Edit Profile
      </ActionButton>
      
      <form action={logout}>
        <ActionButton 
          type="submit"
          variant="danger"
          icon={<FaSignOutAlt size={14} />}
        >
          Logout
        </ActionButton>
      </form>
    </div>
  );
}