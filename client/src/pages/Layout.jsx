import { Outlet,  useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MuiAlert from "@mui/material/Alert";
import { useUserAuth } from "../context/userAuthContext";
import Snackbar from "@mui/material/Snackbar";
import PestControlIcon from "@mui/icons-material/PestControl";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MenuIcon from "@mui/icons-material/Menu";
import { clearMessage, setMessage } from "../redux/actions/messageActions";
import { removeSelectedUser } from "../redux/actions/userActions";

const pages = [
  // { name: "Home", icon: <HomeIcon />, link: "/" },
  { name: "Projects", icon: <FormatListBulletedIcon />, link: "/Projects" },
  { name: "Bugs", icon: <PestControlIcon />, link: "/Bugs" },
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Navbar = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const { user, logOut } = useUserAuth();
  const messageInfo = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const [mobile, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(clearMessage());
  };

  const signOut = async () => {
    try {
      await logOut();
      dispatch(removeSelectedUser());
      dispatch(setMessage(`You have successfully signed out!`));
      navigate("/signin");
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  return (
    <>
      <div className="flex desktop">
        <nav className="full-vh flex-column desktop-nav">
          {user && (
            <>
              <div className="flex-column aic space-around full-height">
                <div className="flex-column gap-lg">
                  <a href="/">Dashboard</a>
                  <a href="/Projects">Projects</a>
                  <a href="/Bugs">Bugs</a>
                  {currentUser.role === "Admin" && (
                    <a href="/manageusers">Manage Users</a>
                  )}
                  {/* <a href="/Bugs">Schedule</a> */}
                </div>
                <div className="flex-column gap-lg">
                  <a href="/Settings">Settings</a>
                  <a href="/Account">Account</a>
                  <a href="/Chat">Chat</a>
                  <span onClick={signOut} className="button-ghost">
                    Log Out
                  </span>
                </div>
              </div>
            </>
          )}
        </nav>
        {/* Popup to show status or crud operations  */}
        <Snackbar
          open={messageInfo.open}
          autoHideDuration={4000}
          onClose={handleAlertClose}
        >
          <Alert
            onClose={handleAlertClose}
            variant="filled"
            severity="success"
            sx={{ width: "100%" }}
          >
            {messageInfo.text}
          </Alert>
        </Snackbar>
        <div className="test flex-column p-md">
          <Outlet />
        </div>
      </div>

      {/* Mobile */}
      <div className="mobile flex-column">
        <nav className="flex-column mobile-nav border">
          {user && (
            <>
              {mobile ? (
                <>
                  <div className="modal " onClick={() => setMobileOpen(false)}>
                    {user && (
                      <>
                        <div className="">
                          <a href="/">Dashboard</a>
                          <a href="/Projects">Projects</a>
                          <a href="/Bugs">Bugs</a>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="mobile-nav-div border">
                    {user && <MenuIcon onClick={() => setMobileOpen(true)} />}
                  </div>
                </>
              )}
            </>
          )}
        </nav>
        {/* Popup to show status or crud operations  */}
        <Snackbar
          open={messageInfo.open}
          autoHideDuration={4000}
          onClose={handleAlertClose}
        >
          <Alert
            onClose={handleAlertClose}
            variant="filled"
            severity="success"
            sx={{ width: "100%" }}
          >
            {messageInfo.text}
          </Alert>
        </Snackbar>
          <Outlet />
      </div>
    </>
  );
};

export default Navbar;
