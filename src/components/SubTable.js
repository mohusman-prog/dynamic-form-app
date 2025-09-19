import React from "react";
import formconfig from "../Config";

const SubTable = () => {
  const submission = JSON.parse(localStorage.getItem("submissions")) || [];
  return (
    <div className="container">
      <h2>Submissions</h2>
      {submission.length === 0 ? (
        <p>No submission yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              {formconfig.map((f) => {
                <th key={f.id}>{f.label}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {submission.map((sub) => {
              <tr key={sub.id}>
                {formconfig.map((f) => {
                  <td key={sub.id}>
                    {Array.isArray(sub[f.id])
                      ? sub[f.id].join(", ")
                      : sub[f.id]}
                  </td>;
                })}
              </tr>;
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubTable;
