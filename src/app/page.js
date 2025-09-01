"use client";

import { useEffect } from "react";
import LandingPage from "./LandingPage/page";

import LocomotiveScroll from 'locomotive-scroll';


export default function Home() {
   useEffect(() => {
    if (typeof window !== "undefined") {
      const locomotiveScroll = new LocomotiveScroll();
      return () => {
        locomotiveScroll.destroy();
      };
    }
  }, []);
  return (
   <> 
   <LandingPage/>
   </>
  );
}
