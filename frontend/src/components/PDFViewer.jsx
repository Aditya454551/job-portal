import React from "react";

const PDFViewer = ({ pdfUrl }) => {
  return (
    <div className="w-full h-[700px] border rounded-2xl overflow-hidden">
      <iframe src={pdfUrl} title="Resume PDF" className="w-full h-full" />
    </div>
  );
};

export default PDFViewer;
