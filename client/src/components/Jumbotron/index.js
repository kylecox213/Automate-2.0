import React from "react";

function Jumbotron({ children }) {
  return (
    <div
      style={{ height: 400,  clear: "both", paddingTop: 30, textAlign: "center" }}
      className="jumbotron"
    >
      {children}
    </div>
  );
}

export default Jumbotron;
