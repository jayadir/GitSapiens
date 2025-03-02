"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "../lib/utils";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {materialDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
export default function CodeBlock({ fileDetails }) {
  console.log(fileDetails);
  const [file, setFile] = useState(fileDetails[0]?.fileName);
  return (
    <div className="max-w-[75vw]">
      <Tabs value={file} onValueChange={(value) => setFile(value)}>
        <div className="overflow-scroll flex gap-2 bg-slate-500 p-1 rounded-md">
          {fileDetails.map((file, index) => (
            <button
              key={file.fileName}
              className={cn(
                "px-2 py-1 rounded-md transition-colors whitespace-nowrap",
                file === fileDetails[0]?.fileName
                  ? "bg-slate-600 text-white"
                  : "bg-slate-500 text-muted-foreground"
              )}
              value={file.fileName}
            >
              {file.fileName}
            </button>
          ))}
        </div>
        {fileDetails.map((file, index) => (
          <TabsContent key={file.fileName} value={file.fileName}>
            <SyntaxHighlighter language="javascript" style={materialDark}>
              {file.fileContent}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
