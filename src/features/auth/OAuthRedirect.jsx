import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/lib/config";
import GoogleLoader from "@/components/GoogleLoader";

function OAuthRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

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
          navigate("/", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error("OAuth redirect failed:", err);
        navigate("/login", { replace: true });
      }
    };

    handleOAuth();
  }, [location.search, navigate]);

  return <GoogleLoader />;
}

export default OAuthRedirect;
