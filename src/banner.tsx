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
          <SpaceBetween direction="horizontal" size="l">
            <Button variant="normal">
              <Link to={`/user`}>{`Update subscribed coin preferences`}</Link>
            </Button>
            <Button variant="primary" onClick={() => signout()}>
              Sign Out
            </Button>
          </SpaceBetween>
        ) : (
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link">
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button variant="link">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </SpaceBetween>
        )
      }
    >
      CryptoCurrencies
    </Header>
  );
}
