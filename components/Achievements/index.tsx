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
        return <TrophyIcon className="mr-3 mt-1 h-6 w-6 text-primary" />;
      case "code":
        return <CodeIcon className="mr-3 mt-1 h-6 w-6 text-primary" />;
      case "star":
        return <StarIcon className="mr-3 mt-1 h-6 w-6 text-primary" />;
      case "award":
        return <AwardIcon className="mr-3 mt-1 h-6 w-6 text-primary" />;
      default:
        return <TrophyIcon className="mr-3 mt-1 h-6 w-6 text-primary" />;
    }
  };

  const handleClick = (link?: string) => {
    if (!link) return;
    // safe client-only action
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-foreground mb-6 flex items-center text-2xl font-semibold">
        <TrophyIcon className="mr-2 h-6 w-6 text-primary" />
        Achievements
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {achievements.map((achievement, index) => (
          <Card
            key={index}
            className={`bg-background transition-colors duration-300 hover:border-primary/50 ${
              achievement.link ? "cursor-pointer" : ""
            }`}
            onClick={() => handleClick(achievement.link)}
          >
            <CardContent className="p-4">
              <div className="flex items-start">
                {getIcon(achievement.iconName)}
                <div>
                  <h4 className="text-foreground text-lg font-semibold">
                    {achievement.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {achievement.description}
                  </p>
                  {achievement.link && (
                    <p className="mt-1 text-sm text-primary hover:underline">
                      View Profile →
                    </p>
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
