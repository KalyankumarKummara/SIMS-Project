import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Modal, Box, Typography, IconButton } from "@mui/material";
import { Close, NavigateBefore, NavigateNext } from "@mui/icons-material";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const ResumePreview = ({ resumeUrl, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  const updateContainerWidth = () => {
    const width = Math.min(window.innerWidth * 0.9, 1200);
    setContainerWidth(width);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Modal open={true} onClose={onClose} sx={{ backdropFilter: "blur(3px)" }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "1200px",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "12px",
          outline: "none",
          display: "flex",
          flexDirection: "column",
          maxHeight: "95vh",
        }}
      >
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #eee",
          background: theme => theme.palette.primary.main,
          color: "white",
          borderRadius: "12px 12px 0 0"
        }}>
          <Typography variant="h6" component="h2">
           Resume Preview
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ 
          flex: 1,
          overflowY: "auto",
          p: 2,
          position: "relative",
          '& .react-pdf__Page': {
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden",
            margin: "0 auto"
          }
        }}>
          <Document 
            file={resumeUrl} 
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <Box sx={{ 
                height: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Typography>Loading PDF...</Typography>
              </Box>
            }
          >
            <Page 
              pageNumber={pageNumber}
              width={containerWidth * 0.85}
              renderAnnotationLayer={false}
              renderTextLayer={true}
              loading={null}
            />
          </Document>
        </Box>

        <Box sx={{
          p: 2,
          borderTop: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f8f9fa"
        }}>
          <Button
            variant="contained"
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            startIcon={<NavigateBefore />}
            sx={{ textTransform: "none" }}
          >
            Previous
          </Button>
          
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Page {pageNumber} of {numPages || "..."}
          </Typography>

          <Button
            variant="contained"
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
            disabled={pageNumber >= (numPages || 1)}
            endIcon={<NavigateNext />}
            sx={{ textTransform: "none" }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ResumePreview;