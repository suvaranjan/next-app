"use client";

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

interface SummaryReaderProps {
  subject: string;
  topic: string;
  onBack: () => void;
}

export default function SummaryReader({
  subject,
  topic,
  onBack,
}: SummaryReaderProps) {
  // This is a placeholder for the summary content
  // You mentioned you'll add the data later
  const summaryContent = `This page will be updated very soon.`;

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
          <CardTitle className="text-center mt-2">{topic}</CardTitle>
          <CardDescription className="text-center">{subject}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p>{summaryContent}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onBack} className="w-full">
            Back to Reading Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
