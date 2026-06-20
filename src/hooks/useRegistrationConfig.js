"use client";

import { useState, useEffect } from "react";

/**
 * Hook to read registration config from env variables.
 * Returns:
 *   - isBeforeOpenDate: true if current time is before the opening date
 *   - isRegistrationClosed: true if REGISTRATION_CLOSED=1
 *   - openDate: the Date object for the opening date
 *   - loading: true while computing (first render)
 */
export function useRegistrationConfig() {
  const [state, setState] = useState({
    isBeforeOpenDate: false,
    isRegistrationClosed: false,
    openDate: null,
    loading: true,
  });

  useEffect(() => {
    const openDateStr =
      process.env.NEXT_PUBLIC_REGISTRATION_OPEN_DATE || "2026-06-22T00:00:00+05:30";
    const closedFlag = process.env.NEXT_PUBLIC_REGISTRATION_CLOSED || "0";

    const openDate = new Date(openDateStr);
    const now = new Date();

    setState({
      isBeforeOpenDate: now < openDate,
      isRegistrationClosed: closedFlag === "1",
      openDate,
      loading: false,
    });
  }, []);

  return state;
}
