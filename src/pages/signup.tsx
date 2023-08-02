import * as React from "react";
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Header from "@cloudscape-design/components/header";
import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";

export default function Signup() {
  const [visible, setVisible] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [errorOccured, setErrorOccured] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  function signup() {
    let error = false;
    if (name === "") {
      error = true;
      setNameError("Name is required");
    } else setNameError("");

    if (email === "") {
      error = true;
      setEmailError("Email is required");
    } else setEmailError("");

    if (password === "") {
      error = true;
      setPasswordError("Password is required");
    } else {
      if (password.length < 8) {
        error = true;
        setPasswordError("Password must be at least 8 characters");
      } else {
        if (password !== confirmPassword) {
          error = true;
          setPasswordError("Passwords do not match");
        } else setPasswordError("");
      }
    }

    if (error) return;

    fetch("https://cryptotracker-api.sankalpmukim.dev/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        setVisible(true);
        // setResponseMessage(data.message);
        return;
      })
      .catch((error) => {
        setVisible(true);
        setErrorOccured(true);
        setResponseMessage("Something went bad");
        return;
      });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signup();
      }}
    >
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none" variant="link">
              Cancel
            </Button>
            <Button variant="primary">Submit</Button>
          </SpaceBetween>
        }
        header={
          <Header variant="h1" description="Join Us to Grow">
            CoinAAAA
          </Header>
        }
      >
        <Container>
          <Modal
            onDismiss={() => setVisible(false)}
            visible={visible}
            footer={
              <Box padding={"l"} float="right">
                <SpaceBetween direction="horizontal" size="xs">
                  {errorOccured ? (
                    <Button
                      variant="normal"
                      onClick={() => {
                        signup();
                      }}
                    >
                      Retry
                    </Button>
                  ) : (
                    <Button
                      variant="link"
                      onClick={() => (window.location.href = "login")}
                    >
                      Login
                    </Button>
                  )}
                  <Button variant="primary" onClick={() => setVisible(false)}>
                    Ok
                  </Button>
                </SpaceBetween>
              </Box>
            }
            header={errorOccured ? "Unsuccessful" : "Sucessfull"}
          >
            {responseMessage}
          </Modal>
          <SpaceBetween direction="vertical" size="l">
            <FormField label="Name" errorText={nameError}>
              <Input
                value={name}
                type="text"
                onChange={(event) => setName(event.detail.value)}
              />
            </FormField>
            <FormField label="Email" errorText={emailError}>
              <Input
                value={email}
                type="email"
                onChange={(event) => setEmail(event.detail.value)}
              />
            </FormField>
            <FormField label="Password" errorText={passwordError}>
              <Input
                value={password}
                type="password"
                onChange={(event) => setPassword(event.detail.value)}
              />
            </FormField>
            <FormField label="Confirm Password" errorText={passwordError}>
              <Input
                value={confirmPassword}
                type="password"
                onChange={(event) => setConfirmPassword(event.detail.value)}
              />
            </FormField>
          </SpaceBetween>
        </Container>
      </Form>
    </form>
  );
}
