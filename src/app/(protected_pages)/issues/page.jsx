"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {Badge} from "../../../components/ui/badge";
import { IconFilter } from "@tabler/icons-react";
import clsx from "clsx";
import {fetch_issues} from "../../../actions/fetch-issues";
import { Button } from "../../../components/ui/button";
import { Tooltip, TooltipProvider,TooltipTrigger,TooltipContent } from "../../../components/ui/tooltip";
import axios from "axios";
import IssueCard from "../../../components/IssueCard";
export default function Page() {
  // const [firstRender, setFirstRender] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const { setValue, handleSubmit } = useForm();
  const [issues, setIssues] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    state: "open",
    language: "javascript",
    sort: "created",
    order: "desc",
    label: "good first issue",
    pageNumber
  });

  const options = {
    state: ["open", "closed"],
    language: [
      "javascript",
      "python",
      "java",
      "c++",
      "go",
      "rust",
      "html",
      "dart",
      "shell",
      "css",
      "php",
      "ruby",
      "swift",
      "typescript",
      "kotlin",
      "c#",
      "r",
      "scala",
      "perl",
    ],
    sort: ["created", "updated", "comments"],
    order: ["desc", "asc"],
    labels: [
      { name: "bug", description: "Something isn’t working" },
      {
        name: "documentation",
        description: "Improvements or additions to documentation",
      },
      {
        name: "duplicate",
        description: "This issue or pull request already exists",
      },
      { name: "enhancement", description: "New feature or request" },
      { name: "good first issue", description: "Good for newcomers" },
      { name: "help wanted", description: "Extra attention is needed" },
      { name: "invalid", description: "This doesn’t seem right" },
      { name: "question", description: "Further information is requested" },
      { name: "wontfix", description: "This will not be worked on" },
    ],
  };
  useEffect(() => {
    // if (firstRender) {
      console.log("fetching issues")
      // setFirstRender(false);
      fetch_issues(selectedFilters).then((res) => {
        setIssues(res.data);
        console.log(res.data)
      });
    // }
  },[])
  const handleFilterChange = (type, value) => {
    setValue(type, value);
    setSelectedFilters((prev) => ({ ...prev, [type]: value }));
  };

  // const toggleLabelSelection = (label) => {
  //   setSelectedFilters((prev) => {
  //     const newLabels = prev.labels.includes(label)
  //       ? prev.labels.filter((l) => l !== label)
  //       : [...prev.labels, label];

  //     setValue("labels", newLabels);
  //     return { ...prev, labels: newLabels };
  //   });
  // };

  const onSubmit = async (data) => {
    // console.log("Filters Applied:", {
    //   ...selectedFilters
    //   // labels: selectedFilters.labels,
    // });
    // console.log("sending request")
    const res=await fetch_issues(selectedFilters);
    // console.log(res)
    setIssues(res.data);
  };

  return (
    <div className="container ml-1 w-full overflow-x-hidden h-[100vh] overflow-y-hidden scrollbar-hide text-white">
      <h1 className="text-3xl font-semibold text-center">Browse Issues</h1>

      <Dialog>
        <DialogTrigger asChild>
          <div className="inline-flex items-center px-4 py-2 border border-white text-white bg-transparent rounded-md cursor-pointer transition duration-300 hover:bg-white hover:text-black">
            Filters <IconFilter className="ml-1" size={20} />
          </div>
        </DialogTrigger>

        <DialogContent className="bg-gray-900 text-white overflow-y-scroll h-[80vh]">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div>
              <h2 className="text-sm font-medium mb-2">State:</h2>
              <div className="flex gap-2">
                {options.state.map((state) => (
                  <Button
                    key={state}
                    onClick={() => handleFilterChange("state", state)}
                    className={clsx(
                      "px-4 py-2 border border-white rounded-md text-sm transition",
                      selectedFilters.state === state
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-white hover:bg-white hover:text-black"
                    )}
                  >
                    {state.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium mb-2">Language:</h2>
              <div className="flex flex-wrap gap-2">
                {options.language.map((lang) => (
                  <Button
                    key={lang}
                    onClick={() => handleFilterChange("language", lang)}
                    className={clsx(
                      "px-4 py-2 border border-white rounded-md text-sm transition",
                      selectedFilters.language === lang
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-white hover:bg-white hover:text-black"
                    )}
                  >
                    {lang.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium mb-2">Sort By:</h2>
              <div className="flex gap-2">
                {options.sort.map((sort) => (
                  <Button
                    key={sort}
                    onClick={() => handleFilterChange("sort", sort)}
                    className={clsx(
                      "px-4 py-2 border border-white rounded-md text-sm transition",
                      selectedFilters.sort === sort
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-white hover:bg-white hover:text-black"
                    )}
                  >
                    {sort.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium mb-2">Order:</h2>
              <div className="flex gap-2">
                {options.order.map((order) => (
                  <Button
                    key={order}
                    onClick={() => handleFilterChange("order", order)}
                    className={clsx(
                      "px-4 py-2 border border-white rounded-md text-sm transition",
                      selectedFilters.order === order
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-white hover:bg-white hover:text-black"
                    )}
                  >
                    {order.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium mb-2">Labels:</h2>
              <TooltipProvider>
                <div className="flex flex-wrap gap-2">
                  {options.labels.map((label) => (
                    <Tooltip key={label.name} text={label.description}>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleFilterChange("label",label.name)}
                          className={clsx(
                            "px-4 py-2 border border-white rounded-md text-sm transition",
                            selectedFilters.label=== label.name
                              ? "bg-blue-600 text-white"
                              : "bg-gray-800 text-white hover:bg-white hover:text-black"
                          )}
                        >
                          {label.name.toUpperCase()}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{label.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>

            <Button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Apply Filters
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <hr className="border-gray-600 mt-2 border-t-[0.5px] border-solid" />
      <div className="flex flex-wrap gap-4 mt-4 mx-2 h-[70vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
        {issues?.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
