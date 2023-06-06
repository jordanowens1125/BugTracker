import * as React from "react";
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    {...props}
    width={30}
    height={30}
  >
    <path d="M2 4a1 1 0 0 1 1-1h18a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1Zm1 9h18a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2Zm0 8h18a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2Z" />
  </svg>
);
export default SvgComponent;
