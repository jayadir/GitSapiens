"use client";
import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import UmlComponent from "../../../components/UmlComponent";
// function UmlComponent({ code }) {
//   const mermaidRef = useRef(null);

//   useEffect(() => {
//     mermaid.initialize({ startOnLoad: true });

//     if (mermaidRef.current) {
//       mermaid.run({
//         nodes: [mermaidRef.current],
//       });
//     }
//   }, [code]);

//   return (
//     <div ref={mermaidRef} className="mermaid">
//       {code}
//     </div>
//   );
// }
export default function Test() {
//   const mermaidRegex = /```(?:mermaid)?\s*([\s\S]*?)```/;
//   const diagram = `diagram \`\`\`mermaid
// flowchart TD
//     A[Frontend (CreateQuestion Component)] --> B{User Input: Title, Description, Tags, Organization}
//     B --> C{Submit Button Clicked}
//     C --> D{Validation: Check if all fields are filled}
//     D -- Yes --> E{Prepare Question Data (title, description, tags, askedBy, uid, Organisation)}
//     D -- No --> F[Display Alert: "Fill all the fields"]
//     E --> G{Check if it's an Update}
//     G -- No (Create) --> H[API Call: POST /api/createQuestion with questionData]
//     H --> I{Backend (QuestionControl.js createQuestion)}
//     I --> J{Create new question document using QuestionModel}
//     J --> K{Save question to MongoDB}
//     K --> L{Return Success Response}
//     H --> M[Navigate to Home Page]
//     G -- Yes (Update) --> N[API Call: PATCH /api/modifyQuestion/{questionId} with questionData]
//     N --> O{Backend (QuestionControl.js updateQuestion)}
//     O --> P{Find and update question in MongoDB}
//     P --> Q{Return Success Response}
//     N --> R[Navigate to Home Page]
// \`\`\``;

//   console.log(diagram);
//   const match = diagram.match(mermaidRegex);
//   console.log("match", match);
  
//     const mermaidCode = match[1];
//     console.log("Mermaid code:", mermaidCode);
const mermaidCode = `
graph TD
    "Question.jsx" --> "handleUpvote"
    "handleUpvote" --> "axios.put(/api/upvote/)"
    "axios.put(/api/upvote/)" --> "backend/Controllers/AnswerController.js: vote"
    "backend/Controllers/AnswerController.js: vote" --> "AnswerModel.js: update upvotes"
    "Question.jsx" --> "setUpvotes(upvotes+1)"



`;

  return (
    <div className="text-white flex flex-col gap-4 p-4">
      <UmlComponent code={mermaidCode} />
    </div>
  );
}
