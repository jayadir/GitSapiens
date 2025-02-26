"use client";
import React, { useState } from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { cn } from "../../../lib/utils";
import { IconBrandGithub } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
// import api from "../../../lib/axios"
import axios from "axios";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  const { register, handleSubmit, reset, watch } = useForm();
  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     console.log("Form submitted");
  //   };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (data) => {
    console.log(data);
    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/create-project", data);
      console.log(response);
      reset();
      if (response.status === 200) {
        router.push("/dashboard");
      }

    } catch (error) {
      console.log(error);
    }
  };
  const [privateProject, setPrivateProject] = useState(false);
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black ">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-8 flex-col">
        <IconBrandGithub className="h-40 w-40" />
        <p className="ml-4 mt-6">Add a Project</p>
      </h2>

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="name">Project Title</Label>
          <Input
            id="name"
            placeholder="Title"
            type="text"
            {...register("projectName", { required: true })}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="url">Repository Url</Label>
          <Input
            id="url"
            placeholder="Url"
            type="text"
            {...register("repositoryUrl", {
              required: "Repository Url is required",
            })}
          />
        </LabelInputContainer>
        {privateProject && (
          <LabelInputContainer className="mb-8">
            <Label htmlFor="Access">Personal Access Token</Label>
            <Input
              id="Access"
              placeholder="Token"
              type="text"
              {...register("accessToken")}
            />
          </LabelInputContainer>
        )}
        <p
          className="text-blue-300 text-sm underline text-center mb-4 cursor-pointer"
          onClick={() => setPrivateProject(!privateProject)}
        >
          Is this a {privateProject ? "Public" : "Private"} repository?
        </p>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isSubmitting}
        >
          Submit &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
