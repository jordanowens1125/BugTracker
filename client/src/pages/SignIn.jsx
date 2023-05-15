import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUserAuth } from "../context/userAuthContext";
import { selectedUser } from "../redux/actions/userActions";
import api from "../api/index";

function Copyright(props) {
  return <>{`Copyright © ${new Date().getFullYear()}`}</>;
}

const SignIn = () => {
  const { user } = useUserAuth();
  const dispatch = useDispatch();

  const { logIn, googleSignIn } = useUserAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const SignInAsDemoDeveloper = async () => {
    setError("");
    try {
      const demoDeveloperPassword =
        process.env.REACT_APP_DEMO_DEVELOPER_PASSWORD;
      const demoDeveloperEmail = process.env.REACT_APP_DEMO_DEVELOPER_EMAIL;
      const result = await logIn(demoDeveloperEmail, demoDeveloperPassword);
      const currentUser = await api.users.fetchUserByEmail(demoDeveloperEmail);

      dispatch(selectedUser(currentUser));
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  const SignInAsDemoAdmin = async () => {
    setError("");
    try {
      const demoAdminPassword = process.env.REACT_APP_DEMO_ADMIN_PASSWORD;
      const demoAdminEmail = process.env.REACT_APP_DEMO_ADMIN_EMAIL;
      const result = await logIn(demoAdminEmail, demoAdminPassword);
      const currentUser = await api.users.fetchUserByEmail(demoAdminEmail);
      dispatch(selectedUser(currentUser));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  //sign in with google
  const GoogleLogin = async (e) => {
    try {
      const result = await googleSignIn();
      const newUser = {};
      newUser.name = result.user.displayName;
      newUser.uid = result.user.uid;
      newUser.email = result.user.email;
      newUser.photoURL = result.user.photoURL;
      //use api to find or create a user
      //will use result.user displayName, photoURL, email, uid
      const userToBeFoundOrCreated = await api.users.findOrCreateUser(newUser);
      dispatch(selectedUser(userToBeFoundOrCreated));
      navigate(`/`);
    } catch (error) {}
  };
  return (
    <>
      <div className="flex-column aic jcc full-height">
        <span>Log In</span>
        <button onClick={SignInAsDemoDeveloper} className="button-primary">
          Login as Demo Developer
        </button>
        <button onClick={SignInAsDemoAdmin}>Login as Demo Admin</button>
        <button>Login with Google</button>
        <button>Sign Up</button>
      </div>
      {/* <Avatar sx={{ m: 1, bgcolor: "white", border: "2px solid #1976d2" }}>
        <LockOutlinedIcon color="primary" />
      </Avatar> */}
      {/* {error && (
        <Alert variant="filled" color="error">
          {error}
        </Alert>
      )} */}
      {/* <Button
        onClick={GoogleLogin}
        aria-label="Login with google"
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Login with Google
      </Button>
      <Button
        aria-label="Sign up with google"
        type="submit"
        fullWidth
        variant="contained"
        onClick={GoogleLogin}
        sx={{ mt: 3, mb: 2 }}
      >
        Sign Up
      </Button>

      <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </>
  );
};

export default SignIn;
