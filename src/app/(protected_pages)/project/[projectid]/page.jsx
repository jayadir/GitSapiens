"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { LabelInputContainer } from "../../../../components/ui/LabelInputContainer";
import { IconBrandGithub } from "@tabler/icons-react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Link } from "lucide-react";
import Commits from "../../../../components/Commits";
import Chat from "../../../../components/Chat";
import { Button } from "../../../../components/ui/button";
import { fetch_repository_issues } from "../../../../actions/fetch-issues";
import { Spinner } from "../../../../components/ui/spinner";
import IssueCard from "../../../../components/IssueCard";
import { useSearchParams } from "next/navigation";
import { useAttachmentsStore } from "../../../../lib/store";
export default function Page() {
  const { addAttachment } = useAttachmentsStore();
  const serachParams = useSearchParams();
  const issueId = serachParams.get("issueId") || null;
  const issueName=serachParams.get("issue") || null;
  const params = useParams();
  const { projectid } = params;
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState();

  useEffect(() => {
    async function fetchProject() {
      const res = await axios.get(`/api/fetch-projects/${projectid}`);
      setProject(res.data.data.project);
    }
    if (projectid) {
      fetchProject();
    }
  }, [projectid]);
  const handleFetchRepositoryIssues = async () => {
    const repositoryUrl = project?.repositoryUrl;
    if (!repositoryUrl) {
      console.error("No repository URL found for the project.");
      return;
    }
    setLoading(true);
    const res = await fetch_repository_issues(repositoryUrl);
    if(res){
      setIssues(res.data)
      console.log(res.data);
    }
    setLoading(false);
  };
  const handleAddAttachment = async (projectId, issue) => {
    // console.log("adding attachment")
    console.log("projectId", projectId);
    console.log("issue", issue);
    addAttachment(projectId, issue);
  }
  return (
    <div className="text-white flex flex-col gap-4 p-4">
      {/* {console.log("issueId", issueId)}
      {console.log("issueName", issueName)} */}
      <h1 className="text-2xl font-bold flex items-center">
        {project?.projectName} <IconBrandGithub className="ml-2" />
      </h1>
      <div>
        <Chat id={projectid} issueId={issueId} issueName={issueName}/>
      </div>

      <div className="flex-1">
        {project && (
          <Button onClick={handleFetchRepositoryIssues} disabled={loading}>
            Fetch Issues{loading && <Spinner size="small" className="text-black" />}
          </Button>
        )}
        {issues.length > 0 && (
          <div className="flex flex-col gap-4 mt-4 overflow-y-scroll h-[80vh] scrollbar-hide">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} disableAdd={true} projectId={projectid} handleAddAttachment={handleAddAttachment}/>
            ))}
          </div>
        )}
        {issues.length === 0 && !loading && (
          <div className="text-center text-gray-500">No issues found.</div>
        )}
      </div>
    </div>
  );
}
