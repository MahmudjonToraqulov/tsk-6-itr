import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const sessionData = sessionStorage.getItem("persist:root");
  const data = JSON.parse(sessionData);

  if (!data || !data.users) {
    return <Navigate to="/" />;
  }

  const usersString = data.users;
  const usersData = JSON.parse(usersString);

  const UserName = usersData.userName;
  if (!UserName) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
