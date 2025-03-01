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
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";

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
        <div className="min-h-screen bg-background p-4 flex items-center justify-center">
          <Card className="w-full max-w-2xl p-8">
            <div className="text-center">
              <p className="text-lg">Loading quiz...</p>
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

  // Get quiz parameters from URL .. Okay
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
    setQuizEnded(true);
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

  // Results view
  if (quizEnded) {
    const results = calculateResults();

    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Test Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold">
                {results.correct} / {results.total}
              </p>
              <p className="text-lg text-muted-foreground">
                You answered {results.correct} out of {results.total} questions
                correctly
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Score Percentage</span>
                <span className="font-medium">{results.percentage}%</span>
              </div>
              <Progress value={results.percentage} className="h-3" />
            </div>

            <div className="rounded-lg border p-4 bg-muted/50">
              <h3 className="font-medium mb-2">Subject: {subject}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Total Questions: {results.total}</div>
                <div>Correct Answers: {results.correct}</div>
                <div>Wrong Answers: {results.total - results.correct}</div>
                <div>
                  Time Taken: {timerMinutes - Math.ceil(timeLeft / 60)} min
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button
              variant="outline"
              className="w-1/2"
              onClick={() => router.push("/test")}
            >
              New Test
            </Button>
            <Button
              className="w-1/2"
              onClick={() => setShowAnswersDrawer(true)}
            >
              Review Answers
            </Button>
          </CardFooter>
        </Card>

        {/* Answers Drawer */}
        <Sheet open={showAnswersDrawer} onOpenChange={setShowAnswersDrawer}>
          <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
            <SheetHeader className="top-0 bg-background z-10 pb-4">
              <SheetTitle className="text-center">
                All Questions and Answers
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-8 pb-16">
              {filteredQuestions.map((question, qIndex) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex flex-col items-start mb-2 gap-2">
                    <h3 className="font-medium text-lg">
                      {qIndex + 1}. {question.question}
                    </h3>
                    {userAnswers[question.id] ? (
                      userAnswers[question.id] === question.answer ? (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" /> Correct
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500">
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
                  </div>
                  <div className="space-y-2 mt-3">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-2 rounded-lg border p-3 ${getOptionClass(
                          question,
                          option
                        )}`}
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
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center">
            <p className="text-lg">Loading questions...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Quiz view
  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
        {/* Header with timer and progress */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span
              className={`font-mono text-lg ${
                timeLeft < 60 ? "text-red-500 animate-pulse" : ""
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Questions : {currentQuestionIndex + 1} / {filteredQuestions.length}
          </div>
        </div>

        {/* Progress bar */}
        <Progress
          value={(answeredCount / filteredQuestions.length) * 100}
          className="w-full h-2 mb-2"
        />

        {/* Question card */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Subject : {currentQuestion.type}
              </span>
              <div className="text-sm">
                Answered : <span className="font-medium">{answeredCount}</span>{" "}
                / {filteredQuestions.length}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Topic : {currentQuestion.topic}
              </span>
            </div>
            <CardTitle className="text-xl">
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1">
            <RadioGroup
              value={userAnswers[currentQuestion.id] || ""}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${
                    userAnswers[currentQuestion.id] === option
                      ? "bg-primary/10 border-primary"
                      : ""
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer"
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
              >
                Previous
              </Button>

              <Button
                onClick={handleSubmitQuiz}
                disabled={answeredCount === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Quiz
              </Button>
              <Button onClick={goToNextQuestion}>Next</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
