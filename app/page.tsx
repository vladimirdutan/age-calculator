"use client";
import Image from "next/image";
import ArrowIcon from "../public/icon-arrow.svg";
import { useState } from "react";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isValid,
  parse,
  subMonths,
  subYears,
} from "date-fns";
import { enGB } from "date-fns/locale";

export default function Home() {
  const [date, setDate] = useState<{
    day: string;
    month: string;
    year: string;
  }>({ day: "", month: "", year: "" });
  const [finalDate, setFinalDate] = useState<{
    years: number;
    months: number;
    days: number;
  }>({ years: 0, months: 0, days: 0 });
  const [errors, setErrors] = useState<{
    day: {
      error: boolean;
      message: string;
    };
    month: {
      error: boolean;
      message: string;
    };
    year: {
      error: boolean;
      message: string;
    };
  }>({
    day: {
      error: false,
      message: "",
    },
    month: {
      error: false,
      message: "",
    },
    year: {
      error: false,
      message: "",
    },
  });

  const validateDate = (value: string, segment: string) => {
    setDate((prev) => ({
      ...prev,
      [segment]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [segment]: {
        error: false,
        message: "",
      },
    }));
  };

  const handleSubmit = () => {
    setFinalDate({
      years: 0,
      months: 0,
      days: 0,
    });
    if (!date.day) {
      setErrors((prev) => ({
        ...prev,
        day: {
          error: true,
          message: "This field is required",
        },
      }));
    }
    if (!date.month) {
      setErrors((prev) => ({
        ...prev,
        month: {
          error: true,
          message: "This field is required",
        },
      }));
    }
    if (!date.year) {
      setErrors((prev) => ({
        ...prev,
        year: {
          error: true,
          message: "This field is required",
        },
      }));
    }
    if (Number(date.day) > 31) {
      setErrors((prev) => ({
        ...prev,
        day: {
          error: true,
          message: "Must be a valid day",
        },
      }));
    }
    if (Number(date.month) > 12) {
      setErrors((prev) => ({
        ...prev,
        month: {
          error: true,
          message: "Must be a valid month",
        },
      }));
    }
    if (Number(date.year) > new Date().getFullYear()) {
      setErrors((prev) => ({
        ...prev,
        year: {
          error: true,
          message: "Must be in the past",
        },
      }));
    }
    if (date.year.length < 4) {
      setErrors((prev) => ({
        ...prev,
        year: {
          error: true,
          message: "Must be a valid year",
        },
      }));
    }

    const parsedDate = parse(
      `${date.day}/${date.month}/${date.year}`,
      "P",
      new Date(),
      { locale: enGB }
    );
    const isValidDate = isValid(parsedDate);

    if (!isValidDate) {
      setErrors((prev) => ({
        ...prev,
        day: {
          error: true,
          message: "Must be a valid date",
        },
      }));
      return;
    }

    calculateAge(parsedDate);
  };

  const calculateAge = (parsedDate: Date) => {
    const currentDate = new Date();

    const years = differenceInYears(currentDate, parsedDate);
    const adjustedDateAfterYears = subYears(currentDate, years);

    const months = differenceInMonths(adjustedDateAfterYears, parsedDate);
    const adjustedDateAfterMonths = subMonths(adjustedDateAfterYears, months);

    const days = differenceInDays(adjustedDateAfterMonths, parsedDate);

    setFinalDate({
      years: years,
      months: months,
      days: days,
    });
  };

  const errorLabelClass = `font-normal text-xs error-text text-sm italic`;

  const inputClass = ` py-2 px-3 md:px-6 flex w-full md:w-[140px] font-bold text-[25px] md:text-[32px] focus:outline-primary caret-primary`;

  return (
    <div className="flex items-center size-full justify-center px-5 md:px-0">
      <div className=" bg-white rounded-t-3xl px-6 py-16  md:p-12 rounded-bl-3xl rounded-br-[175px]">
        {/* INPUTS CONTAINER */}
        <div className="flex space-x-4 md:space-x-8">
          {/* DAY INPUT */}
          <div className="flex flex-col space-y-2">
            <span
              className={`font-semibold text-xs ${
                !errors.day.error ? "text-smokeyGray" : "text-error"
              } tracking-[4px]`}
            >
              DAY
            </span>
            <input
              value={date.day}
              onChange={(e) => validateDate(e.target.value, "day")}
              maxLength={2}
              className={`rounded-md border ${
                !errors.day.error ? "border-lightGray" : "border-error"
              } ${inputClass}`}
            />
            {errors.day.error && (
              <span className={errorLabelClass}>{errors.day.message}</span>
            )}
          </div>
          {/* MONTH INPUT */}
          <div className="flex flex-col space-y-2">
            <span
              className={`font-semibold text-xs ${
                !errors.month.error ? "text-smokeyGray" : "text-error"
              } tracking-[4px]`}
            >
              MONTH
            </span>
            <input
              value={date.month}
              maxLength={2}
              className={`rounded-md border ${
                !errors.month.error ? "border-lightGray" : "border-error"
              } ${inputClass}`}
              onChange={(e) => validateDate(e.target.value, "month")}
            />
            {errors.month.error && (
              <span className={errorLabelClass}>{errors.month.message}</span>
            )}
          </div>
          {/* YEAR INPUT */}
          <div className="flex flex-col space-y-2">
            <span
              className={`font-semibold text-xs ${
                !errors.year.error ? "text-smokeyGray" : "text-error"
              } tracking-[4px]`}
            >
              YEAR
            </span>
            <input
              value={date.year}
              maxLength={4}
              className={`rounded-md border ${
                !errors.year.error ? "border-lightGray" : "border-error"
              } ${inputClass}`}
              onChange={(e) => validateDate(e.target.value, "year")}
            />
            {errors.year.error && (
              <span className={errorLabelClass}>{errors.year.message}</span>
            )}
          </div>
        </div>

        {/* LINE AND ICON */}
        <div className="flex items-center mt-10 md:mt-0">
          <div className="flex-1 md:w-[580px] h-[1.5px] bg-gray-200" />
          <button
            type={"button"}
            onClick={handleSubmit}
            className="size-[90px] hover:bg-offBlack bg-primary flex items-center justify-center rounded-full"
          >
            <Image src={ArrowIcon} alt={"arrow-icon"} className="size-10" />
          </button>
          <div className="flex-1 md:w-[580px] h-[1.5px] bg-gray-200 md:hidden" />
        </div>

        {/* RESULT TEXT */}
        <div className="flex flex-col -space-y-6 mt-10 md:mt-0 md:-space-y-10 text-[60px] md:text-[90px] italic font-bold">
          <div className="flex space-x-2">
            <span className="text-primary">
              {finalDate.years > 0 ? finalDate.years : "- -"}
            </span>
            <span>years</span>
          </div>
          <div className="flex space-x-2">
            <span className="text-primary">
              {finalDate.months > 0 ? finalDate.months : "- -"}
            </span>
            <span>months</span>
          </div>
          <div className="flex space-x-2">
            <span className="text-primary">
              {finalDate.days > 0 ? finalDate.days : "- -"}
            </span>
            <span>days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
