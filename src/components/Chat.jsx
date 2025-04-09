import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "./ui/animatedTextArea";
import { useAttachmentsStore } from "../lib/store";
import MDEditor from "@uiw/react-md-editor";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import axios from "axios";
import { readStreamableValue } from "ai/rsc";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { GenerateDiagram } from "../actions/Diagram";
import { askQuestion } from "../actions/chat";
import CodeBlock from "./CodeBlock";
import { Send, Maximize2, X, Paperclip } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import UmlComponent from "./UmlComponent";
import { DialogTrigger } from "@radix-ui/react-dialog";
export default function Chat({ id, issueId = null, issueName = null }) {
  const [generatingImage, setGeneratingImage] = useState(false);
  const dialogInputRef = useRef(null);
  const { attachments: attachmentState, removeAttachment } =
    useAttachmentsStore();
  const attachments = attachmentState[id] || [];
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [mermaidCode, setMermaidCode] = useState("");
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get(`/api/chat-history/${id}`);
        setChatHistory(res.data.data.messages);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    if (id) {
      fetchChatHistory();
    }
  }, [id]);

  useEffect(() => {
    if (dialogOpen && dialogInputRef.current) {
      dialogInputRef.current.focus();
    }
  }, [dialogOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, response]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const handleGenerateDiagram = async () => {
    console.log("Generating diagram...");
    console.log(message);
    const res = await GenerateDiagram(id, message);
    setMermaidCode(res);
    setMessage("");
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log("submitting");
    // return;
    if (!id || !message.trim()) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    setChatHistory((prev) => {
      return Array.isArray(prev)
        ? [...prev, { role: "user", content: userMessage }]
        : [{ role: "user", content: userMessage }];
    });

    try {
      const { op, files } = await askQuestion(userMessage, id, attachments);
      setFiles(files);

      let aiResponse = "";
      for await (const chunk of readStreamableValue(op)) {
        if (chunk) {
          aiResponse += chunk;
          setResponse((prev) => prev + chunk);
        }
      }

      setChatHistory((prev) => [...prev, { role: "ai", content: aiResponse }]);
      setResponse("");
    } catch (error) {
      console.error("Error submitting question:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Sorry, I encountered an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const ChatMessage = ({ message, isLatestAi }) => (
    <div
      className={`flex items-start gap-3 mb-4 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.role === "ai" && (
        <Avatar className="h-8 w-8 bg-purple-600 flex items-center justify-center">
          <span className="text-xs font-bold">AI</span>
        </Avatar>
      )}

      <div
        className={`relative max-w-[75%] rounded-2xl p-4 ${
          message.role === "user"
            ? "bg-blue-600 text-white"
            : "bg-black border border-gray-700 text-gray-100"
        }`}
      >
        {message.role === "user" ? (
          message.content
        ) : (
          <MDEditor.Markdown
            source={message.content}
            className="prose prose-invert max-w-none"
          />
        )}

        {isLatestAi && files?.length > 0 && (
          <div className="mt-4 ml-2">
            <CodeBlock fileDetails={files} />
          </div>
        )}
      </div>

      {message.role === "user" && (
        <Avatar className="h-8 w-8 bg-blue-700 flex items-center justify-center">
          <span className="text-xs font-bold">YOU</span>
        </Avatar>
      )}
    </div>
  );

  const ChatContainer = () => (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        {chatHistory?.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg}
            isLatestAi={index === chatHistory?.length - 1 && msg.role === "ai"}
          />
        ))}

        {response && (
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-8 w-8 bg-purple-600 flex items-center justify-center">
              <span className="text-xs font-bold">AI</span>
            </Avatar>
            <div className="relative max-w-[75%] rounded-2xl p-4 bg-gray-800 border border-gray-700 text-gray-100">
              <MDEditor.Markdown
                source={response}
                className="prose prose-invert max-w-none"
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="p-4 border-t border-gray-800">
        <form onSubmit={submitHandler} className="flex items-end gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={handleMessageChange}
              className="pr-10 bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitHandler(e);
                }
              }}
            />

            {attachments?.length > 0 && (
              <div className="absolute left-2 bottom-12 flex flex-wrap gap-2 max-w-full pb-2">
                {attachments?.map((attachment, index) => (
                  <Badge
                    key={index}
                    className="bg-gray-700 text-gray-200 flex items-center gap-1"
                  >
                    {attachment?.title?.length > 15
                      ? `${attachment?.title.slice(0, 15)}...`
                      : attachment?.title}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-red-400"
                      onClick={() => removeAttachment(id, attachment.id)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!message.trim() || isLoading}
                  className="bg-white hover:bg-white-200 text-gray-900 flex items-center justify-center"
                >
                  <Send size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
      </div>
    </div>
  );

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="w-[85vw] h-[95vh] max-w-none p-0 bg-gray-900 border-gray-800"
          hidden={!dialogOpen}
        >
          <DialogHeader className="px-6 py-4 border-b border-gray-800">
            <DialogTitle className="text-gray-100">
              Chat {issueName && `- ${issueName}`}
            </DialogTitle>
          </DialogHeader>

          <div className="h-[calc(95vh-80px)]">
            <ChatContainer />
          </div>
        </DialogContent>
      </Dialog>

      <Card className="bg-black border-gray-800 border-solid shadow-md">
        <CardHeader className="border-b border-gray-800">
          <CardTitle className="text-gray-100 flex items-center justify-between">
            <span>Chat {issueName && `- ${issueName}`}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col max-h-60 overflow-y-auto mb-4 border border-gray-800 rounded-md p-3 bg-gray-800/50">
            {chatHistory?.length > 0 ? (
              chatHistory.slice(-3)?.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    msg.role === "user" ? "text-blue-400" : "text-gray-300"
                  }`}
                >
                  <strong>{msg.role === "user" ? "You: " : "AI: "}</strong>
                  <span className="line-clamp-1">{msg.content}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No messages yet</p>
            )}
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Start typing your query..."
                value={message}
                onChange={handleMessageChange}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />

              <div className="mt-2">
                <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Paperclip size={14} />
                  Attachments:
                  {attachments?.length === 0 || attachments[0] === undefined ? (
                    <span className="text-gray-500 italic">None</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {attachments?.map((attachment, index) => (
                        <Badge
                          key={index}
                          className="bg-gray-700 text-gray-200 hover:bg-gray-700 hover:text-gray-200 flex items-center gap-1"
                        >
                          {attachment?.title?.length > 15
                            ? `${attachment?.title.slice(0, 15)}...`
                            : attachment?.title}
                          <X
                            size={14}
                            className="cursor-pointer hover:text-red-400"
                            onClick={() => removeAttachment(id, attachment.id)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </h3>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 flex-1"
                disabled={!message.trim() || isLoading}
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>

              <Button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700"
                title="Open full chat"
              >
                <Maximize2 size={18} className="text-white" />
              </Button>
            </div>
          </form>
          <Dialog className="h-[80vh] overflow-y-scroll">
            <DialogTrigger asChild>
              <Button
                onClick={handleGenerateDiagram}
                className="bg-white text-black hover:bg-gray-300 w-full mt-2"
                disabled={!message.trim() || isLoading}
              >
                {isLoading ? "Generating..." : "Generate Diagram"}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[85vw] h-[95vh] overflow-y-scroll max-w-none p-0 bg-gray-300 border-gray-800">
              <DialogHeader className="px-6 py-4 border-b border-gray-800">
                <DialogTitle className="text-black">
                  Generated Diagram
                </DialogTitle>
              </DialogHeader>
              {mermaidCode === "" ? (
                "Generating..."
              ) : (
                <UmlComponent code={mermaidCode} />
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
