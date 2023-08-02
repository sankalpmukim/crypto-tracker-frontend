import * as React from "react";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import { Link } from "react-router-dom";

export default function Banner() {
  const signout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Header
      variant="h1"
      actions={
        localStorage.getItem("token") ? (
          <Button variant="primary" onClick={() => signout()}>
            Sign Out
          </Button>
        ) : (
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link">
              <Link to="/signin">SignIn</Link>
            </Button>
            <Button variant="link">
              <Link to="/signup">SignUp</Link>
            </Button>
          </SpaceBetween>
        )
      }
    >
      CryptoCurrencies
    </Header>
  );
}
