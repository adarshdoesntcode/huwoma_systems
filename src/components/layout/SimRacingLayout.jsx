import { useState } from "react";

import { Outlet } from "react-router-dom";

function SimRacingLayout() {
  const [tab, setTab] = useState("");
  return <Outlet tab={tab} setTab={setTab} />;
}

export default SimRacingLayout;
