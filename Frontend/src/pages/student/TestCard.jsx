import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const TestCard = ({ test,assessment_type }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleCardClick = () => {
    navigate(`/testinstructions/${test?.contestId || test?.testId || "unknown"}`, { state: { test,assessment_type } });
  };

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Safeguard description
  const description = test?.description || "No description available.";
  const trimmedDescription =
    description.length > 150 ? description.slice(0, 150) + "..." : description;

  return (
    <Card
      variant="outlined"
      style={{
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        marginBottom: "16px",
        cursor: "pointer",
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" style={{ fontWeight: "bold", color: "#1E293B" }}>
            {test?.name || "Unknown Test"}
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" style={{ color: "#6B7280" }}>
              Open
            </Typography>
            <span style={{ color: "#10B981", fontSize: "2rem", marginLeft: "4px" }}>•</span>
          </Box>
        </Box>

        {/* Display description with "More" option */}
        <Typography
          variant="body2"
          style={{ color: "#374151", marginTop: "8px" }}
        >
          {expanded ? description : trimmedDescription}
        </Typography>
        {description.length > 150 && (
          <Button
            size="small"
            style={{ textTransform: "none", marginTop: "4px", color: "#D97706" }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when toggling
              toggleExpand();
            }}
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        )}

        <Typography
          variant="body2"
          style={{ color: "#4B5563", marginTop: "4px", fontStyle: "italic" }}
        >
          {test?.problems?.length || test?.questions?.length || 0} Problems
        </Typography>

        {/* Display Start and End Time */}
        <Box marginTop="8px">
          <Typography variant="body2" style={{ color: "#374151" }}>
            <strong>Start Time:</strong> {formatDate(test?.starttime)}
          </Typography>
          <Typography variant="body2" style={{ color: "#374151" }}>
            <strong>End Time:</strong> {formatDate(test?.endtime)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TestCard;