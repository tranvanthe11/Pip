import React from "react";
import { CFooter } from "@coreui/react";

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="https://pippip.vn" target="_blank" rel="noopener noreferrer">
          Pippip
        </a>
        <span className="ml-1">&copy; 2021 Pippip 1.2.</span>
      </div>
    </CFooter>
  );
};

export default React.memo(TheFooter);
