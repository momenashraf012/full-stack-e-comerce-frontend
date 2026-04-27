import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface IProps {
  isAllowed: boolean;
  redirectPath: string;
  children: ReactNode;
  data?: unknown;
}

const ProtectedRoute = ({
  isAllowed,
  redirectPath,
  children,
  data,
}: IProps) => {
  const location = useLocation();

  if (!isAllowed) {
    // Store the location they tried to access to redirect back after login
    return (
      <Navigate 
        to={redirectPath} 
        replace 
        state={{ from: location, ...((data as object) || {}) }} 
      />
    );
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
