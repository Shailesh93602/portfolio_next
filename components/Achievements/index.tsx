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

  return (
    <motion.div variants={itemVariants}>
      <h3 className="mb-6 flex items-center text-2xl font-semibold text-foreground">
        <TrophyIcon className="mr-2 h-6 w-6 text-primary" />
        Achievements
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {achievements.map((achievement, index) => (
          <Card
            key={index}
            className={`bg-background transition-colors duration-300 hover:border-primary/50 ${
              achievement.link ? "relative" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start">
                {getIcon(achievement.iconName)}
                <div>
                  <h4 className="text-lg font-semibold text-foreground">
                    {achievement.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {achievement.description}
                  </p>
                  {achievement.link && (
                    // after:inset-0 stretches the link over the whole card.
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm text-primary after:absolute after:inset-0 hover:underline"
                    >
                      View Profile →
                    </a>
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
