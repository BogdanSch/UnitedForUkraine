import { FC, useContext, useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

type AuthComplete = "pending" | "success" | "fail";

const Authentication: FC = () => {
  const { authenticateUser } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  const accessToken = decodeURIComponent(searchParams.get("accessToken") || "");
  const refreshToken = decodeURIComponent(
    searchParams.get("refreshToken") || ""
  );
  const accessTokenExpirationTime = decodeURIComponent(
    searchParams.get("accessTokenExpirationTime") || ""
  );
  const refreshTokenExpirationTime = decodeURIComponent(
    searchParams.get("refreshTokenExpirationTime") || ""
  );

  const [authComplete, setAuthComplete] = useState<AuthComplete>("pending");

  useEffect(() => {
    if (
      !accessToken ||
      !refreshToken ||
      !accessTokenExpirationTime ||
      !refreshTokenExpirationTime
    ) {
      setAuthComplete("fail");
      return;
    }

    authenticateUser({
      accessToken,
      refreshToken,
      accessTokenExpirationTime,
      refreshTokenExpirationTime,
    })
      .then(() => setAuthComplete("success"))
      .catch(() => setAuthComplete("fail"));
  }, [
    accessToken,
    refreshToken,
    accessTokenExpirationTime,
    refreshTokenExpirationTime,
    authenticateUser,
  ]);

  if (authComplete === "success") {
    return <Navigate to="/dashboard" replace />;
  }
  if (authComplete === "fail") {
    return <Navigate to="/auth/login" replace />;
  }
  return <p>Authenticating...</p>;
};

export default Authentication;
