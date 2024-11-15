import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

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
import { Image } from "@unpic/react";
import Loader from "@/components/Loader";
import { set } from "lodash";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SimRacingClientStartRace = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  console.log("🚀 ~ SimRacingClientStartRace ~ message:", message);
  const [error, setError] = useState("");
  const [showGrantButton, setShowGrantButton] = useState(false);
  const axiosInstance = useAxios();
  const isRequestInProgress = useRef(false); // Prevent multiple simultaneous requests
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const requestLocation = async () => {
    if (isRequestInProgress.current) return;
    isRequestInProgress.current = true;

    setError(""); // Clear previous error

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
                "Location permission denied. Please enable location."
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

      const { latitude, longitude } = await getCoordinates();

      setIsLoading(true);

      // Send data to backend
      const response = await axiosInstance.post(`/startrace/1`, {
        id,
        coordinates: { latitude, longitude },
      });

      setMessage(response.data); // Set success message
    } catch (err) {
      setError(err.message || "Failed to send data.");
    } finally {
      isRequestInProgress.current = false; // Reset request state
      setIsLoading(false);
    }
  };

  const checkPermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permissionStatus.state === "granted") {
        requestLocation();
      } else if (permissionStatus.state === "denied") {
        setShowGrantButton(true);
        setError("Location permission denied. Please grant permission.");
      } else {
        setShowGrantButton(true);
      }

      permissionStatus.onchange = () => {
        if (permissionStatus.state === "granted") {
          setShowGrantButton(false);
          requestLocation();
        } else {
          setShowGrantButton(true);
        }
      };
    } catch {
      setError("Unable to determine location permission state.");
      setShowGrantButton(true);
    }
  };

  useEffect(() => {
    checkPermission();
  }, [id]);

  return (
    <div className="bg-[url('/bg.webp')] h-screen flex flex-col gap-2 items-center justify-center">
      <Card className="w-[90%]">
        <CardHeader className="pb-2">
          <CardTitle className="py-2">
            <Image
              src="/simracingbyhuwoma.webp"
              alt="logo"
              width={120}
              aspectRatio={3 / 1}
              className="mx-auto"
            />
          </CardTitle>
          <CardDescription className="text-center">
            {!error && showGrantButton && (
              <span className="text-xs">Location permission is required</span>
            )}
            {error && <span className="text-destructive text-xs">{error}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {isLoading && <Loader />}
            {showGrantButton && (
              <Button
                onClick={() => {
                  setError("");
                  requestLocation();
                }}
              >
                Grant Location Permission
              </Button>
            )}
            {message?.message === "RTR" && (
              <div className="flex items-center  py-2 pl-4 justify-between  rounded-lg gap-2 border shadow-md">
                <div>{message?.data?.rigName}</div>
                <Image
                  src="/rig.webp"
                  alt="logo"
                  width={100}
                  aspectRatio={16 / 10}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="w-[90%]">
        <CardHeader></CardHeader>
        <CardContent>
          {message?.message === "RTR" && (
            <form
              // onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4"
              // id="customer"
            >
              <div className="grid gap-2">
                <Label>
                  {errors.customerName ? (
                    <span className="text-destructive">
                      {errors.customerName.message}
                    </span>
                  ) : (
                    <span>Name</span>
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
                  className={errors.customerName ? "border-destructive" : ""}
                />
              </div>
              <div className="grid gap-2">
                <Label>
                  {errors.customerContact ? (
                    <span className="text-destructive">
                      {errors.customerContact.message}
                    </span>
                  ) : (
                    <span>Contact</span>
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
                      String(value).length === 10 || "Number must be 10 digits",
                  })}
                  className={errors.serviceRate ? "border-destructive" : ""}
                />
              </div>
              <Button className="mt-2">Start Race</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimRacingClientStartRace;
