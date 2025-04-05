"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "../../../../components/ui/button";
import Loading from "../../../../components/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const params = useParams();
  const { id } = params;
  const [announcementData, setAnnouncementData] = useState({});
  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`/api/fetch-announcements/${id}`);
      if (res.status === 200) {
        setAnnouncementData(res.data.data);
      }
    }
    fetchData();
  }, []);
  const handleCreategroup=async ()=>{
    // console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
    // return
    const res=await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-group-chat`,{
      userId:session.user._id,
      groupName:announcementData.title,
      groupDescription:announcementData.description,
      projectId:announcementData._id
    })
    if(res.status===200){

      alert("Group created successfully")
      router.push("/chats")
    }
  }
  return Object.keys(announcementData).length !== 0 ? (
    <div>
      <h1 className="text-2xl font-bold m-2">Announcement</h1>
      <hr className="text-white border-white border-solid m-1 " />
      <div className="flex flex-col gap-2 m-2">
        <h1 className="text-xl font-bold text-white">
          {announcementData.title}
        </h1>
        <p className="text-lg text-white">{announcementData.description}</p>
      </div>
      <div className="flex justify-between items-center gap-2 m-2">
        <p>want to create a Project Group? </p>
        <Button onClick={handleCreategroup}>Create Group</Button>
      </div>
    </div>
  ):<Loading/>;
}
