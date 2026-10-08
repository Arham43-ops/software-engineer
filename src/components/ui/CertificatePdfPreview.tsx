"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface CertificatePdfPreviewProps {
  src: string;
  className?: string;
}

export default function CertificatePdfPreview({ src, className = "" }: CertificatePdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "300px 0px", threshold: 0.01 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => {
      const nextWidth = Math.floor(element.clientWidth);
      if (nextWidth > 0) setWidth(nextWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative h-full w-full overflow-hidden bg-white ${className}`}>
      {visible ? (
        <Document
          file={src}
          loading={<div className="absolute inset-0 animate-pulse bg-white" />}
          error={<div className="absolute inset-0 bg-white" />}
          className="flex h-full w-full items-start justify-center overflow-hidden"
        >
          <Page
            pageNumber={1}
            width={width}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            renderForms={false}
            className="block !m-0"
          />
        </Document>
      ) : null}
    </div>
  );
}
