"use client";

import { useEffect, useState } from "react";
import { questions } from "@/data/questions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface MCQReaderProps {
  subject: string;
  topic: string;
  onBack: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  type: string;
  topic: string;
  difficulty: string;
}

export default function MCQReader({ subject, topic, onBack }: MCQReaderProps) {
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Filter questions based on subject and topic
    const filtered = questions.filter(
      (q) => q.type === subject && q.topic === topic
    );
    setFilteredQuestions(filtered);
  }, [subject, topic]);

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-center">
              No Questions Available
            </CardTitle>
            <CardDescription className="text-center">
              No questions found for {subject} - {topic}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={onBack} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reading Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="w-full max-w-4xl mx-auto mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            {/* Back Button - Aligned to the left-center */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="self-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            {/* Card Title and Description - Centered */}
            <div className="flex-1 text-center">
              <CardTitle className="mt-2">
                {subject} - {topic}
              </CardTitle>
              <CardDescription>
                Study Material - {filteredQuestions.length} Questions
              </CardDescription>
            </div>

            {/* Spacer to balance the flex layout */}
            <div className="w-20"></div>
          </div>
        </CardHeader>
      </Card>

      <div className="w-full max-w-4xl mx-auto space-y-6 pb-10">
        {filteredQuestions.map((question, qIndex) => (
          <Card key={question.id} className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">
                {qIndex + 1}. {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 border rounded-lg",
                    option === question.answer
                      ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500"
                      : "bg-card border-border"
                  )}
                >
                  <div className="flex items-center">
                    <span>{option}</span>
                    {option === question.answer}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
