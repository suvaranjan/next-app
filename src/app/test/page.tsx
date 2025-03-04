"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { syllabus } from "@/data/syllabus";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TestPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("All");
  const [topic, setTopic] = useState("All");
  const [questionCount, setQuestionCount] = useState(50);
  const [timer, setTimer] = useState(50);

  const selectedSubject = syllabus.find((s) => s.subject === subject);
  const topics = selectedSubject ? selectedSubject.topic : [];

  const handleStartTest = () => {
    router.push(
      `/quiz?subject=${subject}&topic=${topic}&questionCount=${questionCount}&timer=${timer}`
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center space-y-3">
      {/* Card 1: Back Button, Title, and Description */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" className="flex justify-between items-center">
            <Button variant="ghost" size="sm" className="self-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="flex-1 text-center">
              <CardTitle className="mt-2 mb-2">Test Settings</CardTitle>
              <CardDescription>Configure your test</CardDescription>
            </div>
            <div className="w-20"></div>
          </Link>
        </CardHeader>
      </Card>

      {/* Card 2: Form */}
      <Card className="w-full max-w-md">
        <CardContent className="space-y-8 p-6">
          <div className="space-y-3">
            <Label htmlFor="subject">Choose your subject</Label>
            <Select
              value={subject}
              onValueChange={(value) => {
                setSubject(value);
                setTopic("All");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="विषय चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {syllabus.map((s) => (
                  <SelectItem key={s.subject} value={s.subject}>
                    {s.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="topic">Choose your topic</Label>
            <Select
              value={topic}
              onValueChange={setTopic}
              disabled={subject === "All"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="विषय चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {topics.map((t) => (
                  <SelectItem key={t.slug} value={t.name}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="questions">Number of questions</Label>
              <span className="text-sm font-medium">{questionCount}</span>
            </div>
            <Slider
              id="questions"
              min={1}
              max={100}
              step={1}
              value={[questionCount]}
              onValueChange={(value) => setQuestionCount(value[0])}
              className="py-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>100</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="timer">Timer (in Minutes)</Label>
              <span className="text-sm font-medium">{timer}</span>
            </div>
            <Slider
              id="timer"
              min={1}
              max={50}
              step={1}
              value={[timer]}
              onValueChange={(value) => setTimer(value[0])}
              className="py-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 min</span>
              <span>50 min</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartTest} className="w-full">
            Start Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
