"use client";

import { useState } from "react";
import MyContext from "./ThemeProvider";

const ThemeProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [challenges, setChallenges] = useState([]);

  async function fetchCourses() {
    const res = await fetch("/api/teacher/courses");
    const data = await res.json();
    if (data.success) {
      setCourses(data.data);
    }
  }
  async function fetchChallenges() {
    const res = await fetch("/api/teacher/challenges");
    const data = await res.json();
    if (data.success) {
      setChallenges(data.data);
    }
  }

  let values = {
    courses,
    setCourses,
    fetchCourses,
    challenges,
    setChallenges,
    fetchChallenges,
  };

  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};

export default ThemeProvider;
