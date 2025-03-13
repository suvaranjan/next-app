"use client";

import { useParams } from "next/navigation";
import PDFViewer from "@/components/others/pdf-viewer";

export default function BookPage() {
  const params: { slug: string } = useParams();

  if (!params || !params.slug) {
    return <p className="text-center text-red-500">Invalid book selection.</p>;
  }

  const pdfUrl = `/pdfs/${params.slug}.pdf`;

  // Convert slug to title case and append "Book"
  const formattedTitle =
    params.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") + " Book";

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <PDFViewer url={pdfUrl} title={formattedTitle} />
    </div>
  );
}
