import React from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const DemoUserSignin = () => {
  const { signIn, error, isLoading } = useLogin();
  const navigate = useNavigate();
  const SignInAsDemoDeveloper = async () => {
    let response = await signIn(
      process.env.REACT_APP_DEMO_DEVELOPER_EMAIL,
      process.env.REACT_APP_DEMO_DEVELOPER_PASSWORD
    );
    if (response.ok) {
      navigate("/");
    }
  };

  const SignInAsDemoAdmin = async () => {
    let response = await signIn(
      process.env.REACT_APP_DEMO_ADMIN_EMAIL,
      process.env.REACT_APP_DEMO_ADMIN_PASSWORD
    );
    if (response.ok) {
      navigate("/");
    }
  };

  const SignInAsDemoPM = async () => {
    let response = await signIn(
      process.env.REACT_APP_DEMO_PM_EMAIL,
      process.env.REACT_APP_DEMO_PM_PASSWORD
    );

    if (response.ok) {
      navigate("/");
    }
  };

  // const SignInAsDemoReviewer = async () => {
  //   await signIn(
  //     process.env.REACT_APP_DEMO_REVIEWER_EMAIL,
  //     process.env.REACT_APP_DEMO_REVIEWER_PASSWORD
  //   );
  //   //navigate("/");
  // };

  return (
    <div className="full-height page text-align flex-column aic jcc gap-xl">
      <h1 className="secondary">Login as Demo User</h1>

      <div className="max-w-lg flex mobile-column">
        <button
          className="button-secondary"
          onClick={SignInAsDemoDeveloper}
          disabled={isLoading}
        >
          Demo Developer
        </button>
        <button
          className="button-secondary"
          onClick={SignInAsDemoAdmin}
          disabled={isLoading}
        >
          Demo Admin
        </button>
        <button
          className="button-secondary"
          onClick={SignInAsDemoPM}
          disabled={isLoading}
        >
          Project Manager
        </button>
        {/* <button onClick={SignInAsDemoReviewer} disabled={isLoading}>
          Reviewer
        </button> */}
      </div>
      {error && <span className="error full-width text-align">{error}</span>}
      <a href="/login">Back To Login Page</a>
    </div>
  );
};

export default DemoUserSignin;