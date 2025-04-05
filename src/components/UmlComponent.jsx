"use client";
import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { fixMermaidCode } from "../actions/Diagram"; // Ensure this function exists

export default function UmlComponent({ code }) {
  const mermaidRef = useRef(null);
  const [currentCode, setCurrentCode] = useState(code);
  const [status, setStatus] = useState("Rendering diagram...");

  useEffect(() => {
    const renderMermaid = async (diagramCode) => {
      try {
        setStatus("Rendering diagram...");
        mermaid.initialize({ startOnLoad: false });

        // Ensure mermaid div exists before rendering
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = ""; // Clear previous diagram

          // Render the Mermaid diagram into the div
          const { svg } = await mermaid.render("mermaidChart", diagramCode);
          mermaidRef.current.innerHTML = svg;

          setStatus("Diagram successfully rendered!");
        }
      } catch (error) {
        setStatus(`Fixing Mermaid syntax error: ${error.message}`);

        // Call fixMermaidCode to correct the syntax and retry
        const fixedCode = await fixMermaidCode(diagramCode, error.message);

        if (fixedCode !== diagramCode) {
          setCurrentCode(fixedCode);
        } else {
          setStatus("Unable to fix Mermaid syntax. Please check the input.");
        }
      }
    };

    renderMermaid(currentCode);
  }, [currentCode]);

  return (
    <div>
      <div ref={mermaidRef} className="mermaid"></div>
      <p>{status}</p>
    </div>
  );
}
