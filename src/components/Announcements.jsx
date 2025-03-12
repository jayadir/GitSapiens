"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AnnouncementCard from "./AnnouncementCard";
export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const fetchData = async () => {
    const res = await axios.get(`/api/fetch-announcements`);
    console.log(res.data);
    setAnnouncements(res.data.data.announcements);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {announcements.map((announcement) => (
      <AnnouncementCard key={announcement._id} announcement={announcement} />
    ))}
  </div>;
}
