"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { syllabus } from "@/data/syllabus";

import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import MCQReader from "@/components/others/mcq-reader";

export default function ReadingForm() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [readingStyle, setReadingStyle] = useState("");
  const [readingMode, setReadingMode] = useState("form"); // form, mcq, summary, book
  const router = useRouter();

  const handleRead = () => {
    if (!subject || !topic || !readingStyle) {
      toast.error("Please fill all fields before proceeding");
      return;
    }

    const selectedTopic = getTopicOptions().find((t) => t.value === topic);

    if (readingStyle === "summary") {
      if (selectedTopic) router.push(selectedTopic.slug);
    } else if (readingStyle === "book") {
      if (selectedTopic?.bookSlug) {
        router.push(selectedTopic.bookSlug); // Use bookSlug if available
      } else {
        toast.error("Book link not available for this topic.");
      }
    } else {
      setReadingMode(readingStyle);
    }
  };

  const handleBackToForm = () => {
    setReadingMode("form");
  };

  const getTopicOptions = () => {
    const selectedSubject = syllabus.find((s) => s.subject === subject);
    return selectedSubject
      ? selectedSubject.topic.map((t) => ({
          value: t.name,
          label: t.name,
          slug: t.slug,
          bookSlug: t.bookSlug, // Ensure bookSlug is included
        }))
      : [];
  };

  if (readingMode === "mcq") {
    return (
      <MCQReader subject={subject} topic={topic} onBack={handleBackToForm} />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center space-y-3">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" className="flex justify-between items-center">
            <Button variant="ghost" size="sm" className="self-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="flex-1 text-center">
              <CardTitle className="mt-2 mb-2">Read Mode</CardTitle>
              <CardDescription>Configure settings</CardDescription>
            </div>
            <div className="w-20"></div>
          </Link>
        </CardHeader>
      </Card>

      <Card className="w-full max-w-md">
        <CardContent className="space-y-8 p-6">
          <div className="space-y-3">
            <Label htmlFor="subject">Choose your subject</Label>
            <Select
              value={subject}
              onValueChange={(value) => {
                setSubject(value);
                setTopic("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="विषय चुनें" />
              </SelectTrigger>
              <SelectContent>
                {syllabus.map((s) => (
                  <SelectItem key={s.subject} value={s.subject}>
                    {s.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {subject && (
            <div className="space-y-3">
              <Label htmlFor="topic">Choose topic</Label>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="विषय चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {getTopicOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="reading-style">Choose reading style</Label>
            <Select value={readingStyle} onValueChange={setReadingStyle}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="पढ़ने की शैली चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">MCQ</SelectItem>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="book">Book</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRead} className="w-full">
            Read
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
