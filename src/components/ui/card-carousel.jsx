"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  SparklesIcon,
  Brain,
  Trophy,
  MessageCircle,
  BarChart2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";

export const CardCarousel = ({
  cards,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {
  const css = `
    .swiper {
      width: 100%;
      padding-bottom: 50px;
    }
    .swiper-slide {
      width: 300px;
    }
  `;

  return (
    <section className="w-full bg-gray-100 dark:bg-gray-900 ">
      <style>{css}</style>
      <div className="mx-auto w-full max-w-5xl ">
        <div className="relative mx-auto flex w-full flex-col  bg-gray-100 dark:bg-gray-900 p-2">
          <div className="flex flex-col justify-center  pb-20 pl-4 pt-18 md:items-center">
            <div className="flex gap-2">
              <div>
                <h3 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Smart Tools for Better Learning & Teaching
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Unlock your potential with AI-driven learning paths, progress
                  tracking, and real-time performance insights.
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-4">
            <div className="w-full">
              <Swiper
                spaceBetween={50}
                autoplay={{
                  delay: 0, // 👈 continuous flow, no waiting
                  disableOnInteraction: false,
                  // 👈 right → left
                }}
                speed={5000} // 👈 smooth scrolling speed (increase = slower)
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }}
                pagination={showPagination}
                navigation={
                  showNavigation
                    ? {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }
                    : undefined
                }
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
              >
                {cards.map((card, index) => (
                  <SwiperSlide key={index}>
                    <Card className="text-center hover:shadow-lg transition-shadow p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <CardHeader>{card.icon}</CardHeader>
                      <CardTitle className="text-gray-900 dark:text-gray-100">
                        {card.title}
                      </CardTitle>
                      <CardContent>
                        <CardDescription className="text-gray-700 dark:text-gray-300">
                          {card.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
