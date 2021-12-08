import React from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { Auth } from "@aws-amplify/auth";
import { withSSRContext } from "aws-amplify";
import Router from "next/router";

export const getServerSideProps = async ({ req }) => {
  const { Auth } = withSSRContext({ req });

  console.log({ req });

  let user;

  try {
    user = await Auth.currentAuthenticatedUser();

    return {
      props: {
        userProp: JSON.stringify(user),
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        userProp: null,
        error: JSON.stringify(error),
      },
    };
  }
};

const Profile = ({ userProp }) => {
  const [user, setUser] = React.useState(JSON.parse(userProp));
  const [creds, setCreds] = React.useState({
    username: "",
    password: "",
  });

  const login = async (e) => {
    e.preventDefault();
    try {
      await Auth.signIn(creds.username, creds.password);
      Router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.main}>
      <Link href="/">Home</Link>

      {user ? (
        <>
          <h1>Welcome, {user?.attributes?.username}</h1>
          <button onClick={logout}>Sign Out</button>
        </>
      ) : (
        <>
          <form onSubmit={login}>
            <input
              type="text"
              name="username"
              value={creds.username}
              placeholder="username"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              value={creds.password}
              placeholder="password"
              onChange={handleChange}
            />
            <button type="submit">Sign In</button>
          </form>
          <pre>{JSON.stringify(creds, null, 2)}</pre>
        </>
      )}
    </div>
  );
};

export default Profile;
