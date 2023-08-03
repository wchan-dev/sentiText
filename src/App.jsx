import React, { useEffect, useState } from "react";
// import * as vader from "vader-sentiment";
import { sentimentScoreToText } from "./utils/sentimentScoreToText";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
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
  const [threadTitle, setThreadTitle] = useState("");

  const [vader, setVader] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // dynamically import vader-sentiment
    import("vader-sentiment")
      .then((vaderModule) => {
        setVader(vaderModule);
      })
      .catch((error) => console.log(error));
  }, []);

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

  useEffect(() => {
    setIsLoading(true);
    chrome.storage.local.get(["title"], function (result) {
      setThreadTitle(result.title);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      if (vader) {
        const selectedText = await new Promise((resolve) => {
          chrome.storage.local.get(["selectedText"], function (result) {
            resolve(result.selectedText);
          });
        });

        setSelectedText(selectedText || "");
        const intensity =
          vader.SentimentIntensityAnalyzer.polarity_scores(selectedText);
        const compound = intensity.compound * 100;
        const [text, color] = sentimentScoreToText(compound);
        setSentimentText(text);
        setSelectedTextColor(color);

        const allComments = await new Promise((resolve) => {
          chrome.storage.local.get(["allComments"], function (result) {
            resolve(result.allComments);
          });
        });

        setAllComments(allComments || []);
        let total_compound = 0; // Sum of all compound scores
        let sentisComp = [];
        for (let i = 0; i < allComments.length; i++) {
          const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(
            allComments[i]
          );
          total_compound += intensity.compound * 100; // Add each compound score to the total
          sentisComp.push(intensity.compound * 100);
        }
        const avg_compound = total_compound / allComments.length; // Calculate average
        const [threadText, threadColor] = sentimentScoreToText(avg_compound);
        setThreadSentiment(threadText);
        setThreadSentimentColor(threadColor);
        setSentimentsCompound(sentisComp);
      }
    };

    fetchComments();
  }, [vader]);

  const analyzeThread = async () => {
    await new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "analyzeThread" });
        resolve();
      });
    });

    if (vader) {
      const selectedText = await new Promise((resolve) => {
        chrome.storage.local.get(["selectedText"], function (result) {
          resolve(result.selectedText);
        });
      });

      setSelectedText(selectedText || "");
      const intensity =
        vader.SentimentIntensityAnalyzer.polarity_scores(selectedText);
      const compound = intensity.compound * 100;
      const [text, color] = sentimentScoreToText(compound);
      setSentimentText(text);
      setSelectedTextColor(color);

      const allComments = await new Promise((resolve) => {
        chrome.storage.local.get(["allComments"], function (result) {
          resolve(result.allComments);
        });
      });

      setAllComments(allComments || []);
      let total_compound = 0; // Sum of all compound scores
      let sentisComp = [];
      for (let i = 0; i < allComments.length; i++) {
        const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(
          allComments[i]
        );
        total_compound += intensity.compound * 100; // Add each compound score to the total
        sentisComp.push(intensity.compound * 100);
      }
      const avg_compound = total_compound / allComments.length; // Calculate average
      const [threadText, threadColor] = sentimentScoreToText(avg_compound);
      setThreadSentiment(threadText);
      setThreadSentimentColor(threadColor);
      setSentimentsCompound(sentisComp);
    }
  };
  return (
    <Box padding={2}>
      <Tooltip
        label="Wait for the page to fully load first then click."
        fontSize="xs"
      >
        <Button ml={4} mt={4} size="sm" onClick={analyzeThread}>
          Analyze Thread
        </Button>
      </Tooltip>

      <VStack>
        <Flex gap={2} mt={4} mb={-6} zIndex={2}>
          <Heading size="md">Overall Thread Sentiment:{"  "}</Heading>
          <Heading size="md" color={threadSentimentColor}>
            {" "}
            {threadSentiment}
          </Heading>
        </Flex>
        <Box width="100%" zIndex={1}>
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
