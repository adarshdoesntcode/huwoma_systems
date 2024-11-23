import React, { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useAxios from "@/hooks/useAxios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Loader from "@/components/Loader";
import { set } from "lodash";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/SubmitButton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { IMAGE_DATA } from "@/lib/config";

const SimRacingClientStartRace = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [showGrantButton, setShowGrantButton] = useState(false);
  const axiosInstance = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const isRequestInProgress = useRef(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const requestLocation = async () => {
    if (isRequestInProgress.current) return; // Prevent multiple calls
    isRequestInProgress.current = true;
    setError("");
    try {
      const getCoordinates = async (maxRetries = 3, retryDelay = 1000) => {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            return await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(
                (position) =>
                  resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  }),
                (error) => reject(error)
              );
            });
          } catch (error) {
            if (error.code === error.PERMISSION_DENIED) {
              throw new Error(
                "Location permission denied. Please enable location for this site in your browser settings."
              );
            }
            if (attempt < maxRetries - 1) {
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
            } else {
              throw new Error(
                "Unable to fetch location. Please try again later."
              );
            }
          }
        }
      };

      const coordinates = await getCoordinates();

      if (coordinates) setShowGrantButton(false);

      setIsLoading(true);

      const response = await axiosInstance.post(`/startrace/1`, {
        id,
        coordinates,
      });
      setMessage(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);

      if (err.name === "AxiosError") {
        setError(err.response.data.message);
        return;
      }

      setError(err.message || "Something went wrong");
    } finally {
      isRequestInProgress.current = false;
    }
  };

  const checkPermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permissionStatus.state === "granted") {
        await requestLocation();
      } else if (permissionStatus.state === "denied") {
        setShowGrantButton(true);
        setError(
          "Location permission denied. Please enable location for this site in your browser settings."
        );
      } else {
        setShowGrantButton(true);
      }
    } catch (err) {
      setError("Unable to determine location permission state. ");
      setShowGrantButton(true);
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(`/startrace/2`, {
        customerName: data.customerName,
        customerContact: data.customerContact,
        rigId: id,
      });

      if (response.status === 201 && response.data) {
        const { simRacingKey } = response.data.data;
        localStorage.setItem("simRacingKey", simRacingKey);
        navigate(`/simracingbyhuwoma/myrace`, { replace: true });
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: err.response.data.message || err.message,
      });
    }
  };

  return (
    <div
      className="min-h-dvh py-8 flex flex-col gap-2 items-center justify-center"
      style={{
        backgroundImage: `url(${IMAGE_DATA.background})`,
      }}
    >
      <motion.div
        className="w-[90%] max-w-[400px] space-y-2"
        initial={{ scale: 0.95, opacity: 0.95 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
          bounce: 0.1,
          delay: 0.1,
        }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="py-2">
              <img
                src={IMAGE_DATA.simracing_logo}
                alt="logo"
                width={120}
                loading="defer"
                className="mx-auto"
              />
            </CardTitle>

            {!error && showGrantButton && (
              <CardDescription className="!text-center text-xs">
                Location permission is required to start race
              </CardDescription>
            )}
            {error && (
              <CardDescription className="text-destructive text-xs bg-destructive/10 !text-center border border-destructive rounded-lg px-4 py-6">
                {error}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {isLoading && <Loader />}
              {showGrantButton && (
                <Button
                  className="mt-2"
                  onClick={() => {
                    setError("");
                    requestLocation();
                  }}
                >
                  Grant Location Permission
                </Button>
              )}
              {message?.message === "RTR" && (
                <motion.div className="flex items-center mt-2  py-2 pl-4 justify-between  rounded-lg gap-2 border ">
                  <div className="flex flex-col justify-between gap-4 items-start h-full text-sm font-bold">
                    <div>{message?.data?.rigName}</div>
                    <div className="text-xs font-normal">
                      {" "}
                      Time : {format(new Date(), "hh:mm a")}
                    </div>
                  </div>
                  <img
                    src={IMAGE_DATA.rig}
                    alt="logo"
                    width={100}
                    loading="defer"
                  />
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
        {message?.message === "RTR" && (
          <motion.div
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-4 space-x-1">
                <CardTitle className="text-lg ">Pit Pass</CardTitle>
                <CardDescription className="text-xs !m-0">
                  Fill up to start your lap
                </CardDescription>
              </CardHeader>
              <CardContent className="">
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>
                      {errors.customerName ? (
                        <span className="text-destructive">
                          {errors.customerName.message}
                        </span>
                      ) : (
                        <span>Racer Alias</span>
                      )}
                    </Label>
                    <Input
                      id="customerName"
                      type="text"
                      placeholder="Name"
                      autoFocus
                      {...register("customerName", {
                        required: "Name is required",
                        pattern: {
                          value: /^[a-zA-Z\s]*$/,
                          message: "Invalid Name",
                        },
                      })}
                      className={
                        errors.customerName ? "border-destructive" : ""
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>
                      {errors.customerContact ? (
                        <span className="text-destructive">
                          {errors.customerContact.message}
                        </span>
                      ) : (
                        <span>Racer Contact</span>
                      )}
                    </Label>
                    <Input
                      onWheel={(e) => e.target.blur()}
                      type="tel"
                      inputMode="numeric"
                      placeholder="+977"
                      {...register("customerContact", {
                        required: "Number is required",
                        valueAsNumber: true,
                        validate: (value) =>
                          String(value).length === 10 ||
                          "Number must be 10 digits",
                      })}
                      className={
                        errors.customerContact ? "border-destructive" : ""
                      }
                    />
                  </div>
                  <SubmitButton
                    condition={isSubmitting}
                    loadingText={"Starting Race"}
                    buttonText={"Start Race"}
                    className="mt-2"
                  />
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {message?.message === "CTR" && (
        <Navigate to={`/simracingbyhuwoma/myrace`} />
      )}
    </div>
  );
};

export default SimRacingClientStartRace;
