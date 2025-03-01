import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book, BrainCircuit, MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-small-black/[0.05] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/5 to-background -z-10" />

        <div className="container mx-auto px-4 py-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-6 bg-teal-200 dark:bg-teal-700">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Learning Experience</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-4 p-3">
            AI Learning Platform
          </h1>

          <p className="mt-2 text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-12">
            Revolutionize your learning journey with personalized AI assistance,
            interactive tests, and intelligent discussions.
          </p>

          <div className="w-full max-w-5xl px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="group border border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Book className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    Read Mode
                  </CardTitle>
                  <CardDescription className="text-base">
                    Access and read educational materials with AI-powered
                    insights and annotations
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Link href="/read">
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Start Reading
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group border border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <BrainCircuit className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    Take a Test
                  </CardTitle>
                  <CardDescription className="text-base">
                    Challenge yourself with AI-generated questions tailored to
                    your knowledge level
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Link href="/test">
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Start Test
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group border border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    Discuss with AI
                  </CardTitle>
                  <CardDescription className="text-base">
                    Chat with our AI tutor for personalized help and in-depth
                    explanations
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    disabled
                  >
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[500px] h-[80vw] max-h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-30 -z-10" />
    </div>
  );
}
