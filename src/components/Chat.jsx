import React, { useState } from "react";
import { Input } from "./ui/animatedTextArea";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { readStreamableValue } from "ai/rsc";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { askQuestion } from "../actions/chat";
import CodeBlock from "./CodeBlock";

export default function Chat({ id }) {
  // console.log("id", id);
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log("id",
    // id);

    if (!id || !message.trim()) return;
    setDialogOpen(true);
    setResponse("");
    console.log("id", id);
    const { op, files } = await askQuestion(message, id);
    setFiles(files);

    for await (const chunk of readStreamableValue(op)) {
      if (chunk) {
        setResponse((prev) => prev + chunk); // Ensure proper state updates
      }
    }
  };

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[85vw] h-[85vh] max-w-none">
          <DialogHeader>
            <DialogTitle>Chat Response</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto h-full">
            <MDEditor.Markdown
              source={response}
              className="max-w-full !h-full overflow-scroll"
            />
            <CodeBlock fileDetails={files} />
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler}>
            <Input
              placeholder="Start typing your query..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="h-4"></div>
            <Button type="submit">Send</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
