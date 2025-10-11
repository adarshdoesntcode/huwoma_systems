import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PersistLoader from "@/components/PersistLoader";
import { API_BASE_URL } from "@/lib/config";

function OAuthRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/oauth/google${location.search}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          navigate("/");
        } else {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      }
    };

    handleOAuth();
  }, [location.search, navigate]);

  return <PersistLoader />;
}

export default OAuthRedirect;
