import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SimRacingLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const simRacingKey = localStorage.getItem("simRacingKey");

    if (simRacingKey) {
      axios
        .get("/api/simracing/endpoint", {
          headers: {
            Authorization: `Bearer ${simRacingKey}`,
          },
        })
        .then((response) => {
          if (response.data.navigateTo) {
            navigate(response.data.navigateTo);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          // Handle error as needed
        });
    } else {
      console.warn("No simRacingKey found in local storage.");
      // Handle missing key as needed
    }
  }, [navigate]);

  return <div>SimRacingLayout Content</div>;
}

export default SimRacingLayout;
