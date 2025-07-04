import { clsx } from "clsx";
import jsPDFInvoiceTemplate from "jspdf-invoice-template";

import { twMerge } from "tailwind-merge";
import { GOOGLE_CLIENT_ID, IMAGE_DATA } from "./config";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isTabActive = (currentPath, tab) => {
  return currentPath.includes(tab);
};

export function getGoogleOAuthURL(redirect_uri) {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
}

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

export const findWashCountForCustomer = (transactions, id) => {
  const washCount = transactions.filter((transaction) => {
    return transaction?.service?.id === id;
  });

  return washCount.length;
};
export function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const getTimeDifference = (startTime, endTime, pauseHistory = []) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  let totalPausedTime = 0;

  pauseHistory.forEach(({ pausedAt, resumedAt }) => {
    const paused = new Date(pausedAt);
    const resumed = resumedAt ? new Date(resumedAt) : end;
    totalPausedTime += resumed - paused;
  });

  const differenceInMilliseconds = Math.abs(end - start - totalPausedTime);

  const totalMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return {
    days,
    hours,
    minutes: minutes < 1 ? 1 : minutes,
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

export const getDaysDifference = (date1, date2) => {
  const start = new Date(date1);
  const end = new Date(date2);
  const differenceInMilliseconds = Math.abs(end - start);
  return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
};

export const handlePrint = (data) => {
  let props = {
    outputType: "blob",
    returnJsPDFDocObject: true,
    fileName: `Park_N_Wash_${data.billNo}.pdf`,
    orientationLandscape: false,
    compress: true,
    logo: {
      src: IMAGE_DATA.receipt_logo,
      type: "PNG",
      width: 53.33,
      height: 53.33,
      margin: {
        top: -15,
        left: 0,
      },
    },

    business: {
      name: "Park N Wash by HUWOMA",
      address: "Boudha, Kathmandu",
      phone: "+977-9707863001",
    },
    contact: {
      label: "Bill for",
      name: data.customerName,
      address: `Contact: ${data.customerContact}`,
      phone: `Payment Mode: ${data.paymentMode}`,
    },
    invoice: {
      label: "Bill No: ",
      num: data.billNo,
      invDate: `Initiated At: ${data.createdAt}`,
      invGenDate: `Payment Date: ${data.transactionDate}`,
      headerBorder: false,
      tableBodyBorder: false,
      header: [
        {
          title: "Sn",
          style: {
            width: 10,
          },
        },
        {
          title: "Service",
          style: {
            width: 140,
          },
        },

        {
          title: "Rate",
          style: {
            width: 22,
          },
        },
        { title: "Cost" },
      ],
      table: data.tableList,
      additionalRows: [
        {
          col1: "Gross Amount:",
          col3: data.grossAmount,
          style: {
            fontSize: 10,
          },
        },
        {
          col1: "Discount Amount:",
          col3: data.discountAmount,
          style: {
            fontSize: 10,
          },
        },
        {
          col1: "Net Amount:",
          col3: data.netAmount,
          style: {
            fontSize: 14,
          },
        },
      ],
      invDescLabel: "Bill Note",
      invDesc:
        "Thank you for choosing our car wash services! We appreciate your business and look forward to serving you again. Please keep this bill as a record of your transaction.",
    },
    footer: {
      text: "The invoice is created on a computer and is valid without the signature and stamp.",
    },
    pageEnable: true,
    pageLabel: "Page ",
  };
  const pdfObject = jsPDFInvoiceTemplate(props);
  var blob = pdfObject.blob;
  const blobUrl = URL.createObjectURL(blob);
  const printWindow = window.open(blobUrl, "_blank");
  printWindow.onload = () => printWindow.print();
};

export function getMostDetailedObject(arr) {
  const getDetailScore = (obj) => {
    let score = 0;
    for (const key in obj) {
      if (
        obj[key] &&
        typeof obj[key] === "object" &&
        !Array.isArray(obj[key])
      ) {
        score += getDetailScore(obj[key]);
      } else {
        score++;
      }
    }
    return score;
  };

  return arr.reduce((mostDetailed, current) => {
    return getDetailScore(current) > getDetailScore(mostDetailed)
      ? current
      : mostDetailed;
  }, {});
}
