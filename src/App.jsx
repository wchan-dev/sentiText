import React, { useEffect, useState } from "react";
import * as vader from "vader-sentiment";
import { sentimentScoreToText } from "./utils/sentimentScoreToText";
import { Box, Flex, Text } from "@chakra-ui/react";
import "./App.css";

function App() {
  const [selectedText, setSelectedText] = useState("");
  const [sentimentText, setSentimentText] = useState("");
  const [selectedTextColor, setSelectedTextColor] = useState("");
  const [allComment, setAllComments] = useState([]);
  const [threadSentiment, setThreadSentiment] = useState("");
  const [threadSentimentColor, setThreadSentimentColor] = useState("");

  useEffect(() => {
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
      for (let i = 0; i < result.allComments.length; i++) {
        const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(
          result.allComments[i]
        );
        total_compound += intensity.compound * 100; // Add each compound score to the total
      }
      const avg_compound = total_compound / result.allComments.length; // Calculate average
      const [text, color] = sentimentScoreToText(avg_compound);
      setThreadSentiment(text);
      setThreadSentimentColor(color);
    });
  }, []);

  return (
    <Box padding={4}>
      <Flex>
        <Text>Thread Sentiment:{"  "}</Text>
        <Text color={threadSentimentColor}> {threadSentiment}</Text>
      </Flex>
      {/*
      <Text size="xs">Selected text: {selectedText}</Text>
      <Flex>
        <Text>Sentiment of selected text:</Text>
        <Text color={selectedTextColor}>{sentimentText} </Text>
      </Flex>
*/}
    </Box>
  );
}

export default App;
