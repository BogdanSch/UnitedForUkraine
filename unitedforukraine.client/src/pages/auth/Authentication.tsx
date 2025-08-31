import { FC, useContext, useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

type AuthComplete = "pending" | "success" | "fail";

const Authentication: FC = () => {
  const { authenticateUser, user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  const accessTokenExpirationTime = decodeURIComponent(
    searchParams.get("accessTokenExpirationTime") || ""
  );
  const refreshTokenExpirationTime = decodeURIComponent(
    searchParams.get("refreshTokenExpirationTime") || ""
  );

  const [authComplete, setAuthComplete] = useState<AuthComplete>("pending");

  useEffect(() => {
    if (!accessTokenExpirationTime || !refreshTokenExpirationTime) {
      setAuthComplete("fail");
      return;
    }

    authenticateUser({
      accessTokenExpirationTime,
      refreshTokenExpirationTime,
    })
      .then(() => {
        setAuthComplete("success");
        console.log("Successfully loaded user: ", user);
      })
      .catch(() => setAuthComplete("fail"));
  }, [accessTokenExpirationTime, refreshTokenExpirationTime, authenticateUser]);

  if (authComplete === "success") {
    return <Navigate to="/dashboard" replace />;
  }
  if (authComplete === "fail") {
    return <Navigate to="/auth/login" replace />;
  }
  return <p>Authenticating...</p>;
};

export default Authentication;
