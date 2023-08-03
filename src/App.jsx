import React, { useEffect, useState } from "react";
// import * as vader from "vader-sentiment";
import { sentimentScoreToText } from "./utils/sentimentScoreToText";
import { Box, Flex, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import { usePlotColors } from "./utils/useColors";
import { populateLayout } from "./utils/layout";
import Plot from "react-plotly.js";
import "./App.css";

function App() {
  const [selectedText, setSelectedText] = useState("");
  const [sentimentText, setSentimentText] = useState("");
  const [selectedTextColor, setSelectedTextColor] = useState("");
  const [allComment, setAllComments] = useState([]);
  const [sentimentsCompound, setSentimentsCompound] = useState([]);
  const [threadSentiment, setThreadSentiment] = useState("");
  const [threadSentimentColor, setThreadSentimentColor] = useState("");

  const { textColor, bgColor } = usePlotColors();

  const layout = populateLayout(
    textColor,
    bgColor,
    "Distribution of Negative and Positive Sentiment Comments",
    "Sentiment Score",
    "Comment Count"
  );

  const sentimentRanges = [
    {
      min: -Infinity,
      max: -75,
      color: "DarkRed",
      label: "Extremely Negative",
    },
    { min: -75, max: -50, color: "Red", label: "Very Negative" },
    { min: -50, max: -25, color: "IndianRed", label: "Negative" },
    { min: -25, max: -5, color: "Salmon", label: "Slightly Negative" },
    { min: -5, max: 5, color: "Gray", label: "Neutral" },
    { min: 5, max: 25, color: "LightGreen", label: "Slightly Positive" },
    { min: 25, max: 50, color: "LimeGreen", label: "Positive" },
    { min: 50, max: 75, color: "Green", label: "Very Positive" },
    {
      min: 75,
      max: Infinity,
      color: "DarkGreen",
      label: "Extremely Positive",
    },
  ];

  const data = sentimentRanges.map((range) => {
    return {
      x: [range.label],
      y: [
        sentimentsCompound.filter(
          (sentiment) => sentiment >= range.min && sentiment < range.max
        ).length,
      ],
      type: "bar",
      marker: { color: range.color },
      name: range.label,
    };
  });

  const [vader, setVader] = useState(null);

  useEffect(() => {
    // dynamically import vader-sentiment
    import("vader-sentiment")
      .then((vaderModule) => {
        setVader(vaderModule);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (vader) {
      chrome.storage.local.get(["selectedText"], function (result) {
        setSelectedText(result.selectedText || "");
        const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(
          result.selectedText
        );
        const compound = intensity.compound * 100;
        const [text, color] = sentimentScoreToText(compound);
        setSentimentText(text);
        setSelectedTextColor(color);
      });

      chrome.storage.local.get(["allComments"], function (result) {
        setAllComments(result.allComments || []);
        let total_compound = 0; // Sum of all compound scores
        let sentisComp = [];
        for (let i = 0; i < result.allComments.length; i++) {
          const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(
            result.allComments[i]
          );
          total_compound += intensity.compound * 100; // Add each compound score to the total
          sentisComp.push(intensity.compound * 100);
        }
        const avg_compound = total_compound / result.allComments.length; // Calculate average
        const [text, color] = sentimentScoreToText(avg_compound);
        setThreadSentiment(text);
        setThreadSentimentColor(color);
        setSentimentsCompound(sentisComp);
      });
    }
  }, [vader]);
  return (
    <Box padding={2}>
      <VStack>
        <Flex gap={2} mt={4} mb={-6} zIndex={2}>
          <Heading size="md">Overall Thread Sentiment:{"  "}</Heading>
          <Heading size="md" color={threadSentimentColor}>
            {" "}
            {threadSentiment}
          </Heading>
        </Flex>
        <Box width="100%" mt={-2} zIndex={1}>
          <Plot
            data={data}
            layout={layout}
            config={{ responsive: true }}
            style={{ width: "100%" }}
          />
        </Box>
      </VStack>
    </Box>
  );
}

export default App;
