import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isTabActive = (currentPath, tab) => {
  return currentPath.includes(tab);
};

export const getInitials = (fullName) => {
  const parts = fullName.split(" ");
  const firstNameInitial = parts[0].charAt(0).toUpperCase();
  const lastNameInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstNameInitial}${lastNameInitial}`;
};

export const roleByCode = (obj, value) => {
  return Object.keys(obj).find((key) => obj[key] === value);
};

export const generateBillNo = () => {
  const now = new Date();

  const year = now.getFullYear().toString().slice(-2);
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const date = ("0" + now.getDate()).slice(-2);

  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  const billNo = `${year}${month}${date}-${randomNumber}`;

  return billNo;
};

export const findWashCount = (transactions, id) => {
  const washCount = transactions.filter((transaction) => {
    return transaction?.service?.id?._id === id;
  });

  return washCount.length;
};
export function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const getTimeDifference = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const differenceInMilliseconds = Math.abs(end - start);
  const differenceInHours = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60)
  );
  const differenceInMinutes = Math.floor(
    (differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );

  return {
    hours: differenceInHours,
    minutes: differenceInMinutes,
  };
};

export const timeDifference = (date1, date2, buffer) => {
  const date1conv = new Date(date1);
  const differenceInMinutes = Math.abs(date2 - date1conv) / (1000 * 60);
  if (differenceInMinutes >= buffer) {
    return true;
  } else {
    return false;
  }
};
