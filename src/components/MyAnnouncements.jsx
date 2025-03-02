"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { Input as TextArea } from "./ui/animatedTextArea";
import { LabelInputContainer } from "./ui/LabelInputContainer";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { HoverEffect } from "./ui/card-hover-effect";
// import { TextArea } from "./ui/textarea";
import { Button } from "./ui/button";
import { IconCirclePlus } from "@tabler/icons-react";
import { createAnnouncement } from "../actions/announcement";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function MyAnnouncements() {
  const { data: session, status } = useSession();
  // console.log(session);
  const { register, handleSubmit, reset, watch } = useForm();
  const [announcements, setAnnouncements] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = async () => {
    const res = await axios.get(`/api/fetch-userannouncements/${session.user._id}`);
    console.log(res.data);
    setAnnouncements(res.data.data.announcements);
  };

  const onSubmit = async (data) => {
    // console.log(data);
    const res = await createAnnouncement(data, session.user._id);
    console.log(res);
    if (res.status === 200) {
      setIsDialogOpen(false);
      fetchData(); // Fetch the data again after the announcement is added
      // reset();
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  return (
    <div>
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center justify-center "
      >
        Create Announcement <IconCirclePlus />
      </Button>
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        className="overflow-y-scroll h-[75vh]"
      >
        <DialogContent className="overflow-y-scroll h-[75vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              Enter Details of Project
            </DialogTitle>
          </DialogHeader>
          <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
            <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer>
                  <Label htmlFor="title">Project Title*</Label>
                  <Input
                    id="title"
                    placeholder="GitHub"
                    type="text"
                    {...register("title", { required: true })}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="requiredNumber">
                    No. of Contributors Required*
                  </Label>
                  <Input
                    id="lastname"
                    placeholder="5"
                    type="number"
                    {...register("requiredNumber", { required: true })}
                  />
                </LabelInputContainer>
              </div>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="projectUrl">Repository Url*</Label>
                <Input
                  id="projectUrl"
                  placeholder="www.github.com"
                  type="text"
                  {...register("projectUrl", { required: true })}
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="description">Description*</Label>
                <TextArea
                  id="description"
                  placeholder="Give a description about project and what kind of work you are expecting from contributors"
                  type="password"
                  {...register("description", { required: true })}
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-8">
                <Label htmlFor="requiredSkills">Skills Required*</Label>
                <Input
                  id="requiredSkills"
                  placeholder="Pyhton,Java,Javascript"
                  type="text"
                  {...register("requiredSkills", { required: true })}
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-8">
                <Label htmlFor="websiteUrl">Website Url</Label>
                <Input
                  id="websiteUrl"
                  placeholder="Enter the url of the website(if exists)"
                  type="text"
                  {...register("websiteUrl")}
                />
              </LabelInputContainer>
              {/* <div className="grid grid-cols-2 items-center"> */}
              {/* <LabelInputContainer>
                <Label htmlFor="deadline">Website Url</Label>
                <Input
                  id="deadline"
                  placeholder="deadline"
                  type="date"
                />
              </LabelInputContainer> */}
              <Button
                className="bg-gradient-to-br relative group/btn from-black mx-1 dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                type="submit"
              >
                Sign up &rarr;
              </Button>
              {/* </div> */}
            </form>
          </div>
        </DialogContent>
      </Dialog>
      <div className="overflow-y-scroll h-full">
        <HoverEffect items={announcements
          .map((announcement) => ({
            title: announcement.title,
            description: announcement.description.split(" ").slice(0, 10).join(" ") + "...",
            link: `/announcement/${announcement._id}`,
          }))
          .reverse()} />
      </div>
    </div>
  );
}
