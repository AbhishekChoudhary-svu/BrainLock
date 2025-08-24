"use client";

import { useState } from "react";
import MyContext from "./ThemeProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ThemeProvider = ({ children }) => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [user, setUser] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState([]);


  
  const [loading, setLoading] = useState(true);

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
  async function fetchAllUsers() {
    const res = await fetch("/api/user/allUsers");
    const data = await res.json();
    if (data.success) {
      setAllUsers(data.data);
    }
  }
  async function fetchProfile() {
  try {
    let res = await fetch("/api/user", {
      method: "GET",
      credentials: "include",
    });

    if (res.status === 401 || res.status === 403) {
      const refreshRes = await fetch("/api/auth/refreshToken", {
        method: "POST",
        credentials: "include", 
      });

      const refreshData = await refreshRes.json();

      if (refreshRes.ok && refreshData.success) {
        res = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
        });
      } else {
        toast.error( "Session expired. Please login.");
        router.push("/LoginPage");
        return;
      }
    }
    //refreshData.error ||

    const data = await res.json();

    if (!res.ok || !data.success) {
      toast.error(data.error || "Failed to load profile");
      return;
    }

    setUser(data.user);
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
    router.push("/LoginPage");
  } finally {
    setLoading(false);
  }
  }
  async function fetchLeaderboard() {
      const res = await fetch("/api/leaderboard/classRank");
      const data = await res.json();
      if (data.success) {
        const formatted = data.leaderboard.map((student) => ({
          ...student,
          rank: student.classRank,
          isCurrentUser: student._id === user._id,
        }));
        setLeaderboard(formatted);
      }
  }
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/system");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };





  let values = {
    courses,
    setCourses,
    fetchCourses,
    challenges,
    setChallenges,
    fetchChallenges,
    allUsers, 
    setAllUsers,
    fetchAllUsers,
    user, 
    setUser,
    fetchProfile,
    leaderboard, 
    setLeaderboard,
    fetchLeaderboard,
    stats, 
    setStats,
    fetchStats,
  };

  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};

export default ThemeProvider;
