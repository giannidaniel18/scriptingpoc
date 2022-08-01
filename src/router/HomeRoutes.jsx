import React from "react";
import { Route, Routes } from "react-router-dom";

import SinesterLayout from "../layouts/SinesterLayout";
import Home from "../pages/Home";
import BranchContainer from "../pages/siniestros/BranchContainer";

export default function HomeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/siniestros" element={<SinesterLayout />}>
        <Route
          path="/siniestros/:selectedbranch"
          element={<BranchContainer />}
        />
      </Route>
    </Routes>
  );
}