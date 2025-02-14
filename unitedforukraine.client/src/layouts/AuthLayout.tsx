import { FC } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: FC = () => {
  return (
    <>
      <main className="main">
        <Outlet />
      </main>
      <svg width="0" height="0" className="hidden"></svg>
    </>
  );
};

export default AuthLayout;
