"use client";
import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
// import {octokit}
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconRobot,
  IconCirclePlus,
  IconBriefcase2,
  IconZoomCode,
} from "@tabler/icons-react";
import ProfileDialog from "../../components/ProfileDialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useProjects } from "../../hooks/useProjects";
import Link from "next/link";
import { useSession } from "next-auth/react";
// import Link from "next/navigation"
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";
export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);
  if (status === "loading") return <p>Loading...</p>;
  return session ? (
    <div className="flex h-screen">
      <div className="relative z-10 ">
        <SidebarDemo />
      </div>

      <div className="relative flex-1 z-0">{children}</div>
    </div>
  ) : null;
}
export function SidebarDemo({ children }) {
  const { data: session, status } = useSession();
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Browse Issues",
      href: "/issues",
      icon: <IconZoomCode className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Project Announcements",
      href: "/announcements",
      icon: <IconBriefcase2 className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Ask",
      href: "#",
      icon: <IconRobot className="text-white h-5 w-5 flex-shrink-0" />,
    },
  ];

  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar
        open={open}
        setOpen={setOpen}
        className="z-20 fixed h-screen left-0 top-0"
      >
        <SidebarBody className="justify-between gap-10 bg-neutral-900">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} className="text-white" />
              ))}
              <SidebarLink
                link={{
                  label: "Logout",
                  href: "#",
                  icon: (
                    <IconArrowLeft className="text-white h-5 w-5 flex-shrink-0" />
                  ),
                }}
                onClick={() => {
                  console.log("Sign out");
                  signOut();
                }}
                className="text-white"
              />
            </div>
            {open ? (
              <Projects />
            ) : (
              <IconCirclePlus className="text-white h-5 w-5 mt-3 flex-shrink-0" />
            )}
          </div>

          <div>
            <Dialog>
              <DialogTrigger asChild>
                <SidebarLink
                  link={{
                    label: session.user.name,
                    href: "#",
                    icon: (
                      <Image
                        src={session.user.image}
                        className="h-7 w-7 flex-shrink-0 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ),
                  }}
                  className="text-white"
                />
              </DialogTrigger>
              <DialogContent className="dark:bg-gray-800 dark:text-white max-w-md p-6 rounded-xl">
                <DialogHeader>
                  <DialogTitle>Profile</DialogTitle>
                </DialogHeader>
                <ProfileDialog user={session.user._id}/>
              </DialogContent>
            </Dialog>
          </div>
        </SidebarBody>
      </Sidebar>
      {/* <Dashboard /> */}
      <div className="flex-1">{children}</div>
      {/* {children} */}
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};
const Projects = () => {
  const { projects: projectsList, loading, error } = useProjects();
  console.log(projectsList);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="mt-8 flex flex-col gap-2">
      <h3 className="text-white  font-medium">Projects</h3>
      {projectsList?.map((project, idx) => (
        <Link
          key={idx}
          href={`project/${project._id}` || "#"}
          className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
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
      ))}

      <Button className="w-full">
        <Link
          href="/add-project"
          className="flex items-center justify-center w-full"
        >
          {" "}
          <IconCirclePlus className="text-black h-5 w-5 flex-shrink-0 mx-2" />
          Add Project
        </Link>
      </Button>
    </div>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex gap-2">
          {[...new Array(4)].map((_, i) => (
            <div
              key={"first-array" + i}
              className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((_, i) => (
            <div
              key={"second-array" + i}
              className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
