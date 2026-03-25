import { motion } from "framer-motion";
import { HeartIcon } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { itemVariants } from "@/constants";
import { Hobby } from "@/types";

export function HobbiesSection() {
  const hobbies: Hobby[] = [
    {
      title: "Chess",
      description: "Strategic thinking and planning through chess matches",
      icon: "♟️",
    },
    {
      title: "Football",
      description: "Playing football for teamwork and physical fitness",
      icon: "⚽",
    },
    {
      title: "Puzzle Solving",
      description:
        "Solving Sudoku puzzles and Rubik's cubes for mental agility",
      icon: "🧩",
    },
    {
      title: "Learning",
      description: "Exploring new technologies and expanding knowledge",
      icon: "📚",
    },
  ];

  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-text-primary mb-6 flex items-center text-2xl font-semibold">
        <HeartIcon className="mr-2 h-6 w-6 text-primary" />
        Hobbies
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {hobbies.map((hobby, index) => (
          <Card key={index} className="bg-dark">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                {hobby.icon}
                <div>
                  <h4 className="text-text-primary text-lg font-semibold">
                    {hobby.title}
                  </h4>
                  <p className="text-text-secondary">{hobby.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
