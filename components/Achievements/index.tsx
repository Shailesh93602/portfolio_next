"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrophyIcon, CodeIcon, StarIcon, AwardIcon } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { achievements, itemVariants } from "@/constants";
import { Achievement } from "@/types";

export default function AchievementsSection() {
  const getIcon = (iconName: Achievement["iconName"]) => {
    switch (iconName) {
      case "trophy":
        return <TrophyIcon className="w-6 h-6 text-primary mr-3 mt-1" />;
      case "code":
        return <CodeIcon className="w-6 h-6 text-primary mr-3 mt-1" />;
      case "star":
        return <StarIcon className="w-6 h-6 text-primary mr-3 mt-1" />;
      case "award":
        return <AwardIcon className="w-6 h-6 text-primary mr-3 mt-1" />;
      default:
        return <TrophyIcon className="w-6 h-6 text-primary mr-3 mt-1" />;
    }
  };

  const handleClick = (link?: string) => {
    if (!link) return;
    // safe client-only action
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-2xl font-semibold mb-6 text-text-primary flex items-center">
        <TrophyIcon className="w-6 h-6 mr-2 text-primary" />
        Achievements
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement, index) => (
          <Card
            key={index}
            className={`bg-dark transition-colors duration-300 hover:border-primary/50 ${
              achievement.link ? "cursor-pointer" : ""
            }`}
            onClick={() => handleClick(achievement.link)}
          >
            <CardContent className="p-4">
              <div className="flex items-start">
                {getIcon(achievement.iconName)}
                <div>
                  <h4 className="text-lg font-semibold text-text-primary">
                    {achievement.title}
                  </h4>
                  <p className="text-text-secondary">{achievement.description}</p>
                  {achievement.link && (
                    <p className="text-primary text-sm mt-1 hover:underline">View Profile →</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}