import React, { useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import { Spinner } from "./ui/spinner";
export default function ProjectComponent({ project }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteProject = async (projectId) => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/delete-project/${projectId}`);
      console.log(response.data.message);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
    setIsDeleting(false);
    // const { projects: projectsList, loading, error } = useProjects();
  };
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`project/${project._id}` || "#"}
          className="font-normal flex space-x-2 items-center justify-between text-sm text-white py-1 relative z-20 "
        >
          <div className="h-5 w-6 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium text-white whitespace-pre"
          >
            {project.projectName}
          </motion.span>
        </Link>
        {isDeleting?<Spinner size="small"/>:<IconTrash
          className="text-white h-5 w-5 flex-shrink-0 cursor-pointer mr-1"
          onClick={() => handleDeleteProject(project._id)}
        />}
      </div>
    </div>
  );
}
