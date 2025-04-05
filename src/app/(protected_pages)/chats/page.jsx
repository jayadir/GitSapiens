"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import GroupCard from "../../../components/GroupCard";
import Loading from "../../../components/Loading";
export default function page() {
  const { data: session, status } = useSession();
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fetch-groups/${session.user._id}`
      );
      console.log(res.data.data);
        if (res.status === 200) {
            setGroups(res.data.data || []);
        }
    };
    fetchData();
    // console.log(groups);
  }, []);
  return groups?.length === 0 ? (
    <div>
      <Loading />
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold m-2">My Groups</h1>
      <hr className="text-white border-white border-solid m-1 " />
      <div className="flex flex-col gap-2 m-2">
        {groups?.map((group) => (
          <GroupCard key={group._id} group={group.groupId} />
        ))}
      </div>
    </div>
  );
}
