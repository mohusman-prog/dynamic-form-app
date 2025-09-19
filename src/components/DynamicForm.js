import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { ValidateField } from "../utils/Validation";
import formconfig from "../Config";

export default function DynamicForm() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const Navigate = useNavigate();

  const handleChange = (field, value) => {
    let newValue = value;

    if (field.type === "chechbox") {
      const prev = values[field.id] || [];
      newValue = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
    }
    setValues({ ...values, [field.id]: newValue });

    const error = ValidateField(field, newValue);
    setErrors({ ...errors, [field.id]: error });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    formconfig.forEach((f) => {
      newErrors[f.id] = ValidateField(f, values[f.id]);
    });
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err);
    if (hasError) return;

    const submission = { id: Date.now().toString(), ...values };
    const existing = JSON.parse(localStorage.getItem("submissions")) || [];
    localStorage.setItem(
      "submissions",
      JSON.stringify([...existing, submission])
    );

    setValues({});
    Navigate("/submissions");
  };

  return (
    <div className="container">
      <h2>Dynamic Form</h2>
      <Form onSubmit={handleSubmit}>
        {formconfig.map((field) => (
          <div key={field.id} className="form-group">
            <label>{field.label}</label>
            {(field.type === "text" ||
              field.type === "email" ||
              field.type === "number") && (
              <input
                type={field.type}
                value={values[field.id] || ""}
                onChange={(e) => handleChange(field, e.target.value)}
              />
            )}

            {field.type === "select" && (
              <select
                value={values[field.id] || ""}
                onChange={(e) => handleChange(field.e.target.value)}
              >
                <option value="">Select</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === "radio" &&
              field.options.map((opt) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name={field.id}
                    value={opt}
                    checked={values[field.id] === opt}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                  {opt}
                </label>
              ))}
            {field.type === "checkbox" &&
              field.options.map((opt) => (
                <label key={opt}>
                  <input
                    type="checkbox"
                    value={opt}
                    checked={values[field.id]?.includes(opt) || false}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                  {opt}
                </label>
              ))}
            {errors[field.id && <p className="error">{errors[field.id]}</p>]}
          </div>
        ))}

        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
