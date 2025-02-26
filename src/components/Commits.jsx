"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Timeline } from "./ui/timeline";
export default function Commits({ id }) {
  const [commits, setCommits] = useState([]);
  useEffect(() => {
    async function fetchCommits() {
      const { data } = await axios.get(`/api/fetch-commits/${id}`);
      console.log(data.data.newCommits);
      if (data.data.newCommits) {
        const commitlist = data.data.newCommits.map((commit) => {
          const cleanedText = cleanCommitMessage(commit?.aiSummary);
          console.log(cleanedText);
          return {
            title: commit?.author,
            link: commit?.url,
            // content: (<div className="text-white"><strong>{cleanedText.file}:</strong> {cleanedText.description}</div>),
            content: (
              <div className="text-white">
                {cleanedText.map((line, index) => (
                  <div key={index}>
                    <strong>{line.file}:</strong> {line.description}
                  </div>
                ))}
              </div>
            ),
          };
        });
        setCommits(commitlist);
      }
    }
    if (id) {
      fetchCommits();
    }
  }, [id]);
  // useEffect(()=>{

  // })
  return (
    <div className="h-[500px] md:h-full overflow-y-auto border border-neutral-700 p-4 rounded-lg">
      <Timeline data={commits} />
    </div>
  );
}
const cleanCommitMessage = (rawText) => {
  return rawText
    .replace(/`/g, "") // Remove backticks
    .replace(/No description provided\./g, "") // Remove unnecessary descriptions
    .replace(/images\/icon-:\s*/g, "images/icon-") // Fix broken image description
    .split("*") // Split by bullet points (if any)
    .map((line) => line.trim()) // Trim whitespace
    .filter((line) => line) // Remove empty lines
    .map((line) => {
      const parts = line.split(":"); // Split filename from description
      return {
        file: parts[0]?.trim() || "General",
        description: parts[1]?.trim() || "No description provided.",
      };
    });
};
