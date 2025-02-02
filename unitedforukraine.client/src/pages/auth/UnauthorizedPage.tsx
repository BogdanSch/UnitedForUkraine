import { FC } from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage: FC = () => (
  <div>
    <h1>Unauthorized page</h1>
    <p>You don't have permission to access this page.</p>
    <Link to="/login">Go back to login.</Link>
  </div>
);

export default UnauthorizedPage;
