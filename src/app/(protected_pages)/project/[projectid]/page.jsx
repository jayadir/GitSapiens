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
export default function Page() {
  const params = useParams();
  const { projectid } = params;
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

  return (
    <div className="text-white flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold flex items-center">
        {project?.projectName} <IconBrandGithub className="ml-2" />
      </h1>
      <div><Chat id={projectid}/></div>

      <div className="flex-1">
        {/* {console.log(projectid)} */}
        {/* <Commits id={projectid} /> */}
      </div>
    </div>
  );
}
