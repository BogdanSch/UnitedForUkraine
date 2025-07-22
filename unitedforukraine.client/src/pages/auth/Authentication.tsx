import { FC, useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

type AuthComplete = "pending" | "success" | "fail";

const Authentication: FC = () => {
  const { token } = useParams();
  const { authenticateUser } = useContext(AuthContext);

  const [authComplete, setAuthComplete] = useState<AuthComplete>("pending");

  useEffect(() => {
    if (!token) {
      setAuthComplete("fail");
      return;
    }

    authenticateUser(token)
      .then(() => setAuthComplete("success"))
      .catch(() => setAuthComplete("fail"));
  }, [token, authenticateUser]);

  if (authComplete === "success") {
    return <Navigate to="/dashboard" replace />;
  }
  if (authComplete === "fail") {
    return <Navigate to="/auth/login" replace />;
  }
  return <p>Authenticating...</p>;
};

export default Authentication;
