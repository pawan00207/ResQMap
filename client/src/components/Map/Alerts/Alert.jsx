import React from "react";

// Simple Alert component
function Alert({ type = "default", className = "", children, ...props }) {
  let baseStyle = "border rounded-lg px-4 py-3 text-sm w-full";

  let variantStyle =
    type === "destructive"
      ? "bg-red-100 text-red-700 border-red-400"
      : "bg-gray-100 text-black border-gray-300";

  return (
    <div
      role="alert"
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Alert Title
function AlertTitle({ children, className = "", ...props }) {
  return (
    <div
      className={`font-semibold mb-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Alert Description
function AlertDescription({ children, className = "", ...props }) {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

export { Alert, AlertTitle, AlertDescription };