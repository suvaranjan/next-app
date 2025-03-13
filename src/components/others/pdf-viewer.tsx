"use client";

import { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { zoomPlugin } from "@react-pdf-viewer/zoom";

// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

interface PDFViewerProps {
  url: string;
  title?: string;
}

export default function PDFViewer({ url, title }: PDFViewerProps) {
  const [mounted, setMounted] = useState(false);

  // Initialize plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const toolbarPluginInstance = toolbarPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const zoomPluginInstance = zoomPlugin();

  // Only render on client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on the server
  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-[300px] w-full border rounded-md">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center my-8 border rounded-lg bg-card">
      {title && <h3 className="text-xl font-semibold mt-2 mb-2">{title}</h3>}

      <div className="w-full h-[100vh] bg-white">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={url}
            plugins={[
              defaultLayoutPluginInstance,
              toolbarPluginInstance,
              pageNavigationPluginInstance,
              zoomPluginInstance,
            ]}
            renderError={() => (
              <div className="flex flex-col justify-center items-center h-full p-4">
                <p className="text-destructive font-medium mb-2">
                  Failed to load PDF. Please check the URL.
                </p>
                <p className="text-sm text-muted-foreground">
                  Attempted to load: {url}
                </p>
                <div className="mt-4 p-4 bg-muted rounded-md text-sm">
                  <p className="font-medium">Troubleshooting tips:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Verify the PDF exists at: public{url}</li>
                    <li>Check if the file name is correct (case-sensitive)</li>
                    <li>Try using a different PDF viewer</li>
                  </ul>
                </div>
              </div>
            )}
          />
        </Worker>
      </div>
    </div>
  );
}
