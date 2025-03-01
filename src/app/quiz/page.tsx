"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  FileText,
  BookOpen,
  Award,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
  type: string;
  difficulty: string;
  topic: string;
};

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-4 flex items-center justify-center">
          <Card className="w-full max-w-2xl p-8 shadow-lg border-t-4 border-t-primary">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
              <p className="text-lg font-medium">Loading quiz...</p>
            </div>
          </Card>
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get quiz parameters from URL
  const subject = searchParams.get("subject") || "All";
  const questionCount = Number.parseInt(
    searchParams.get("questionCount") || "20"
  );
  const timerMinutes = Number.parseInt(searchParams.get("timer") || "20");

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [quizEnded, setQuizEnded] = useState(false);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [showAnswersDrawer, setShowAnswersDrawer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and prepare questions
  useEffect(() => {
    let filtered = [...questions];

    // Filter by subject if not "All"
    if (subject !== "All") {
      filtered = filtered.filter((q) => q.type === subject);
    }

    // Shuffle questions
    filtered = filtered.sort(() => Math.random() - 0.5);

    // Limit to questionCount
    filtered = filtered.slice(0, questionCount);

    setFilteredQuestions(filtered);
  }, [subject, questionCount]);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Current question
  const currentQuestion = filteredQuestions[currentQuestionIndex];

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  // Navigation
  const goToNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Calculate results
  const calculateResults = () => {
    let correct = 0;

    filteredQuestions.forEach((question) => {
      if (userAnswers[question.id] === question.answer) {
        correct++;
      }
    });

    return {
      total: filteredQuestions.length,
      correct,
      percentage: Math.round((correct / filteredQuestions.length) * 100),
    };
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      setQuizEnded(true);
      setIsSubmitting(false);
    }, 1000);
  };

  // Count answered questions
  const answeredCount = Object.keys(userAnswers).length;

  // Get option class based on answer status
  const getOptionClass = (question: Question, option: string) => {
    const userAnswer = userAnswers[question.id];
    const correctAnswer = question.answer;

    if (!userAnswer) {
      // Not answered
      return option === correctAnswer ? "bg-green-100 border-green-500" : "";
    }

    if (option === correctAnswer) {
      // Correct answer
      return "bg-green-100 border-green-500";
    }

    if (option === userAnswer && userAnswer !== correctAnswer) {
      // Wrong answer selected
      return "bg-red-100 border-red-500";
    }

    return "";
  };

  // Get score color based on percentage
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-amber-600";
    return "text-red-600";
  };

  // Results view
  if (quizEnded) {
    const results = calculateResults();

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg border-t-4 border-t-primary animate-fadeIn">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Test Results
            </CardTitle>
            <CardDescription className="text-center">
              {results.percentage >= 70
                ? "Great job! You've done well on this quiz."
                : "Keep practicing! You'll improve with time."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="text-center space-y-2 py-4">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-primary/20">
                <p
                  className={cn(
                    "text-4xl font-bold",
                    getScoreColor(results.percentage)
                  )}
                >
                  {results.percentage}%
                </p>
              </div>
              <p className="text-xl font-medium mt-4">
                {results.correct} / {results.total} correct answers
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Score</span>
                <span
                  className={cn(
                    "font-medium",
                    getScoreColor(results.percentage)
                  )}
                >
                  {results.percentage}%
                </span>
              </div>
              <Progress
                value={results.percentage}
                className="h-3 rounded-full"
                // indicatorClassName={cn(
                //   "rounded-full",
                //   results.percentage >= 80
                //     ? "bg-green-500"
                //     : results.percentage >= 60
                //     ? "bg-amber-500"
                //     : "bg-red-500"
                // )}
              />
            </div>

            <div className="rounded-lg border p-6 bg-muted/30 shadow-sm">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Quiz Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="px-2 py-1">
                    Subject
                  </Badge>
                  <span>{subject}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="px-2 py-1">
                    Questions
                  </Badge>
                  <span>{results.total}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge
                    variant="outline"
                    className="px-2 py-1 bg-green-300 dark:bg-green-700"
                  >
                    Correct
                  </Badge>
                  <span>{results.correct}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge
                    variant="outline"
                    className="px-2 py-1 bg-red-300  dark:bg-red-700"
                  >
                    Wrong
                  </Badge>
                  <span>{results.total - results.correct}</span>
                </div>
                <div className="flex items-center gap-2 text-sm md:col-span-2">
                  <Badge variant="outline" className="px-2 py-1">
                    <Timer className="h-3 w-3 mr-1" />
                    Time Taken
                  </Badge>
                  <span>{timerMinutes - Math.ceil(timeLeft / 60)} minutes</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              variant="outline"
              className="w-full sm:w-1/2 gap-2"
              onClick={() => router.push("/test")}
            >
              <RotateCcw className="h-4 w-4" />
              New Test
            </Button>
            <Button
              className="w-full sm:w-1/2 gap-2"
              onClick={() => setShowAnswersDrawer(true)}
            >
              <FileText className="h-4 w-4" />
              Review Answers
            </Button>
          </CardFooter>
        </Card>

        {/* Answers Drawer */}
        <Sheet open={showAnswersDrawer} onOpenChange={setShowAnswersDrawer}>
          <SheetContent
            side="bottom"
            className="h-[85vh] overflow-y-auto rounded-t-xl"
          >
            <SheetHeader className="sticky top-0 bg-background z-10 pb-4 pt-2">
              <SheetTitle className="text-center flex items-center justify-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Questions & Answers
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-6 pb-16">
              {filteredQuestions.map((question, qIndex) => (
                <div
                  key={question.id}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col items-start mb-3 gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <Badge
                        variant="outline"
                        className="h-6 min-w-6 flex items-center justify-center rounded-full p-0"
                      >
                        {qIndex + 1}
                      </Badge>
                      <h3 className="font-medium text-lg flex-1">
                        {question.question}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-1">
                      {userAnswers[question.id] ? (
                        userAnswers[question.id] === question.answer ? (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" /> Correct
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500 hover:bg-red-600">
                            <XCircle className="h-3 w-3 mr-1" /> Incorrect
                          </Badge>
                        )
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-yellow-500 text-yellow-700"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" /> Not Attempted
                        </Badge>
                      )}

                      <Badge variant="outline" className="bg-muted/50">
                        {question.topic}
                      </Badge>

                      <Badge variant="outline" className="bg-muted/50">
                        {question.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mt-3">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center space-x-2 rounded-lg border p-3 transition-all",
                          getOptionClass(question, option),
                          option === question.answer
                            ? "border-l-4 border-l-green-500"
                            : "",
                          option === userAnswers[question.id] &&
                            option !== question.answer
                            ? "border-l-4 border-l-red-500"
                            : ""
                        )}
                      >
                        <div className="flex-1">
                          {option}
                          {option === question.answer && (
                            <span className="ml-2 text-green-600 text-sm font-medium">
                              (Correct)
                            </span>
                          )}
                          {option === userAnswers[question.id] &&
                            option !== question.answer && (
                              <span className="ml-2 text-red-600 text-sm font-medium">
                                (Wrong)
                              </span>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Loading state
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8 shadow-lg border-t-4 border-t-primary">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
            <p className="text-lg font-medium">Loading questions...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Quiz view
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-4 flex flex-col">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
        {/* Header with timer and progress */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1",
                timeLeft < 60
                  ? "bg-red-100 text-red-700 animate-pulse"
                  : "bg-muted"
              )}
            >
              <Clock className="h-4 w-4" />
              <span className="font-mono text-lg font-medium">
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="h-4 w-px bg-muted-foreground/30"></div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10">
                {subject}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </span>

            <div className="h-4 w-px bg-muted-foreground/30"></div>

            <span className="text-sm">
              Answered:{" "}
              <span className="font-medium text-primary">{answeredCount}</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1 px-1">
            <span>Progress</span>
            <span>
              {Math.round((answeredCount / filteredQuestions.length) * 100)}%
            </span>
          </div>
          <Progress
            value={(answeredCount / filteredQuestions.length) * 100}
            className="w-full h-2 rounded-full"
            // indicatorClassName="rounded-full"
          />
        </div>

        {/* Question card */}
        <Card className="flex-1 flex flex-col shadow-lg border-t-4 border-t-primary animate-fadeIn">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-primary/10">
                {currentQuestion.type}
              </Badge>

              <Badge variant="outline" className="bg-muted">
                {currentQuestion.difficulty}
              </Badge>

              <Badge variant="outline" className="bg-muted">
                {currentQuestion.topic}
              </Badge>
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 pt-4">
            <RadioGroup
              value={userAnswers[currentQuestion.id] || ""}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all hover:border-primary/50",
                    userAnswers[currentQuestion.id] === option
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    className="text-primary"
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>

          <CardFooter className="border-t pt-4 flex flex-col gap-4">
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={goToPrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>

              <Button
                onClick={handleSubmitQuiz}
                disabled={answeredCount === 0 || isSubmitting}
                className="bg-green-600 hover:bg-green-700 gap-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit
                  </>
                )}
              </Button>

              <Button onClick={goToNextQuestion} className="gap-1">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Question navigation */}
            <div className="pt-2">
              <div className="text-xs text-muted-foreground mb-2">
                Question Navigation:
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredQuestions.map((_, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-8 h-8 p-0 rounded-md",
                      index === currentQuestionIndex &&
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                      userAnswers[filteredQuestions[index].id] &&
                        index !== currentQuestionIndex &&
                        "bg-primary/20"
                    )}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
