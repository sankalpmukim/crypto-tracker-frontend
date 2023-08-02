import * as React from "react";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";

export default () => {
  const [inputValue, setInputValue] = React.useState("");
  return (
    <FormField description="This is a description." label="Form field label">
      <Input
        value={inputValue}
        onChange={(event) => setInputValue(event.detail.value)}
      />
    </FormField>
  );
};
