"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "../lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ fileDetails }) {
  console.log(fileDetails);

  const [file, setFile] = useState(fileDetails[0]?.fileName || "");

  return (
    <div className="max-w-[75vw] min-h-[50vh] mt-2">
      <Tabs value={file} onValueChange={(value) => setFile(value)}>
 
        <div className="relative w-full mx-1 overflow-x-auto no-scrollbar">
          <TabsList className="flex gap-2 p-1 ml-1">
            {fileDetails.map((fileItem) => (
              <TabsTrigger
                key={fileItem.fileName}
                value={fileItem.fileName}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  file === fileItem.fileName
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
                )}
              >
                {fileItem.fileName}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

       
        {fileDetails.map((fileItem) => (
          <TabsContent key={fileItem.fileName} value={fileItem.fileName}>
            <SyntaxHighlighter language="javascript" style={materialDark}>
              {String(fileItem.fileContent)} {/* Ensure it's a string */}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
