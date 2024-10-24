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
