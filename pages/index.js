import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import "@aws-amplify/ui-react/styles.css";
import { withSSRContext } from "aws-amplify";

export const getServerSideProps = async ({ req }) => {
  const { Auth } = withSSRContext({ req });

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

export default function Home({ userProp }) {
  const user = JSON.parse(userProp);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Amplify Next App</h1>
        <h2>Welcome, {user?.attributes?.email}</h2>

        <section>
          <h2>Pages</h2>
          <ul>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
