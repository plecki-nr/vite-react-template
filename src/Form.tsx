import { useState } from "react";

export type FormValues = {
  name: string;
  description: string;
};
type FormProps = {
  onSubmit: ({ name, description }: FormValues) => void;
};

const Form = ({ onSubmit }: FormProps) => {
  const [values, setValues] = useState<FormValues>({
    name: "",
    description: "",
  });

  const setField = (value: string, fieldName: "name" | "description") => {
    setValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleOnSubmit} className="flex">
      <label>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={(e) => setField(e.target.value, "name")}
          required
        />
        <br />
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={values.description}
          onChange={(e) => setField(e.target.value, "description")}
          required
        />
      </label>
      <button type="submit">Add</button>
    </form>
  );
};

export default Form;
