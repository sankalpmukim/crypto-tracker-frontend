import * as React from "react";
import Autosuggest from "@cloudscape-design/components/autosuggest";
import Box from "@cloudscape-design/components/box";
import Input from "@cloudscape-design/components/input";
import FormField from "@cloudscape-design/components/form-field";
import Form from "@cloudscape-design/components/form";
import { SpaceBetween, Button, Header } from "@cloudscape-design/components";
import { Container } from "@cloudscape-design/components";
import Banner from "../banner";

export default function User() {
  const [value, setValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  // const [prices, setPrices] = React.useState({
  //   lowPrice: 0,
  //   highPrice: 0,
  // });
  const [lowPrice, setLowPrice] = React.useState("0");
  const [highPrice, setHighPrice] = React.useState("0");
  React.useEffect(() => {
    async function asyncFn() {
      const data = await fetch(
        "https://cryptotracker-api.sankalpmukim.dev/coins",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());

      setOptions(
        data.coins.map((v) => ({
          value: v.coin,
        }))
      );
    }
    asyncFn();
  }, []);

  const [userCoins, setUserCoins] = React.useState<
    {
      userId: string;
      coinAssetType: string;
      lowPrice: number;
      highPrice: number;
    }[]
  >([]);
  React.useEffect(() => {
    async function asyncFn() {
      const data = await fetch(
        "https://cryptotracker-api.sankalpmukim.dev/users/coins",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());

      setUserCoins(data.userCoins);
    }
    asyncFn();
  }, []);

  interface SubmissionType {
    coin: string;
    lowPrice: number;
    highPrice: number;
  }

  const updatePreferences = () => {
    const oldPrefs: SubmissionType[] = userCoins.map((v) => ({
      ...v,
      coin: v.coinAssetType,
    }));

    const newPrefs = {
      coin: value,
      lowPrice: Number(lowPrice),
      highPrice: Number(highPrice),
    };

    // final prefs remove newPrefs.coin from oldPrefs
    const finalPrefs = oldPrefs.filter((v) => v.coin !== newPrefs.coin);
    // add newPrefs to oldPrefs
    finalPrefs.push(newPrefs);

    fetch("https://cryptotracker-api.sankalpmukim.dev/users/coins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        coins: finalPrefs,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setUserCoins(res.userCoins);
      });
  };

  return (
    <>
      <Banner />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updatePreferences();
        }}
      >
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="m">
              <Button formAction="none" variant="link">
                Cancel
              </Button>
              <Button variant="primary">Submit</Button>
            </SpaceBetween>
          }
        >
          <Box variant="p" padding={"m"}>
            <h1>Select your coin preferences</h1>
            <Autosuggest
              onChange={({ detail }) => setValue(detail.value)}
              value={value}
              options={options}
              ariaLabel="Autosuggest example with suggestions"
              placeholder="Enter value"
              empty="No matches found"
            />
            <FormField label="Lower Limit">
              <Input
                type="text"
                value={String(lowPrice)}
                onChange={(e) => setLowPrice(e.detail.value)}
              />
            </FormField>
            <FormField label="Upper Limit">
              <Input
                type="text"
                value={String(highPrice)}
                onChange={(e) => setHighPrice(e.detail.value)}
              />
            </FormField>
          </Box>
        </Form>

        <Box variant="p" padding={"m"}>
          <h1>Your coin preferences</h1>
          {userCoins.map((v) => (
            <KeyValuePair
              coinName={v.coinAssetType}
              lowPrice={v.lowPrice}
              highPrice={v.highPrice}
            />
          ))}
        </Box>
      </form>
    </>
  );
}

const ValueWithLabel = ({ label, children }) => (
  <div>
    <Box variant="awsui-key-label">{label}</Box>
    <div>{children}</div>
  </div>
);

interface PairProps {
  coinName: string;
  lowPrice: number;
  highPrice: number;
}

function KeyValuePair({ coinName, lowPrice, highPrice }: PairProps) {
  return (
    <Container header={<Header headingTagOverride="h3">{coinName}</Header>}>
      <SpaceBetween size="l">
        <ValueWithLabel label="Lower Limit">
          {lowPrice ?? `not set`}
        </ValueWithLabel>
        <ValueWithLabel label="Upper Limit">
          {highPrice ?? `not set`}
        </ValueWithLabel>
      </SpaceBetween>
    </Container>
  );
}
