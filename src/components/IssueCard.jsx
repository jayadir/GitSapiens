import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Globe, User, CheckCircle, Clock, Info, Github } from "lucide-react";
import { IconPlus } from "@tabler/icons-react";
import MDEditor from "@uiw/react-md-editor";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
} from "./ui/dialog";
import { Spinner } from "./ui/spinner";
import axios from "axios";
export default function IssueCard({ issue, disableAdd = false,handleAddAttachment,projectId="" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { title, body, labels, comments, created_at, updated_at, html_url } =
    issue || {};
  const previewDesc = body?.slice(0, 100).concat("...");
  const handleAddProject = async () => {
    setLoading(true);
    const projectName=issue.repository_url.split("/")[-1]
    const res=await axios.post("/api/create-project", { repositoryUrl: issue?.repository_url,projectName })
    if (res.status === 200) {
      handleAddAttachment(projectId,issue)
      router.push(`/project/${res.data.data.project._id}`);
    } else {
      console.error("Error adding project:", res.data.message);
    }
    setLoading(false);
  };
  const handleAttachment = async () => {
    handleAddAttachment(projectId,issue)
  };
  return (
    <div>
      <Card className="bg-black text-white shadow-lg border border-white border-solid lg:w-[84vw] max-w-[85vw]">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <p className="text-gray-300 mb-3">{previewDesc}</p> */}
          <MDEditor.Markdown
            source={previewDesc}
            // className=''
          />
          <div className="flex flex-wrap gap-2 mb-4 mt-3">
            {labels.map((label, index) => (
              <Badge key={index} className="bg-gray-700 text-gray-200">
                {label.name}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              {new Date(created_at).toDateString()}
            </div>
            <div className="flex items-center gap-1">
              <User size={16} />
              {comments} Comments
            </div>
            <div
              className={`flex items-center gap-1 ${
                issue.state === "open" ? "text-green-400" : "text-red-400"
              }`}
            >
              <CheckCircle size={16} />
              {issue.state === "open" ? "Open" : "Closed"}
            </div>
            <div className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-gray-300 border-gray-600"
                  >
                    <Info size={16} className="mr-2" />
                    More Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="h-[75vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                  </DialogHeader>
                  <MDEditor.Markdown source={body} />
                  <DialogFooter>
                    {disableAdd ? (
                      <Button
                        //   variant="outline"
                        className="border-gray-600"
                        onClick={handleAttachment}
                        disabled={loading}
                      >
                        <IconPlus size={16} />
                        Attach for chat {loading && <Spinner size="small" />}
                      </Button>
                    ) : (
                      <Button
                        //   variant="outline"
                        className="border-gray-600"
                        onClick={handleAddProject}
                        disabled={loading}
                      >
                        <IconPlus size={16} />
                        {loading ? "Adding" : "Add Project For AI Chat"}{" "}
                        {loading && <Spinner size="small" />}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="text-gray-300 border-gray-600"
                      onClick={() => window.open(html_url, "_blank")}
                    >
                      <Github size={16} className="mr-2" />
                      View on Github
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
