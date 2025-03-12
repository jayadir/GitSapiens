import { useEffect, useState } from "react";
import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
import {Input as Textarea} from "./ui/animatedTextArea"
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import axios from "axios";
import { Badge } from "./ui/badge";
// import { set } from "mongoose";
export default function Profile({ user: userId }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const res = await axios.get(`/api/users/${userId}`);
      // setUser(res.data);
      setFormData({ ...res.data.data.user });
      setLoading(false);
    };
    fetchUser();
  }, [userId]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleButtonClick=async()=>{
    if(editMode){
      const res=await axios.put(`/api/users/${userId}`,formData)
      if(res.status===200){
        setFormData({...res.data.data.user})
        setEditMode(false)
      }
    }else{
      setEditMode(true)
    }
  }
  // useEffect(() => {
  //   console.log(user);
  //   console.log(formData);
  // }, [user, formData]);

  return loading ? (
    <p>loading</p>
  ) : (
    <div className="dark:bg-gray-800 dark:text-white p-6 rounded-xl w-full max-w-md">
      <div className="flex flex-col items-center">
        <img
          src={formData?.image || "/default-avatar.png"}
          alt="Profile"
          className="w-20 h-20 rounded-full border"
        />
        <h2 className="text-xl font-semibold mt-2">{formData?.name}</h2>
        <p className="text-gray-400">{formData?.email}</p>
      </div>
      <div className="space-y-4 mt-4">
        {editMode ? (
          <div className="space-y-3">
            <Input
              name="name"
              value={formData?.name || ""}
              onChange={handleChange}
              placeholder="Name"
            />
            <Input
              name="username"
              value={formData?.username || ""}
              onChange={handleChange}
              placeholder="Username"
            />
            <Textarea
              name="bio"
              value={formData?.bio || ""}
              onChange={handleChange}
              placeholder="Bio"
            />
            <Input
              name="image"
              value={formData?.image || ""}
              onChange={handleChange}
              placeholder="Image URL"
            />
            <Input
              name="skills"
              value={formData?.skills?.join(",") || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skills: e.target.value.split(","),
                })
              }
              placeholder="Skills (comma-separated)"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Username:</strong> {formData?.username || "N/A"}
            </p>
            <p>
              <strong>Bio:</strong> {formData?.bio || "No bio available."}
            </p>
            <p>
              <strong>Skills:</strong>{" "}
              {formData?.skills?.length
                ? (formData?.skills || []).map((skill) => (
                    <Badge key={skill} className="mr-1">
                      {skill}
                    </Badge>
                  ))
                : "No skills added."}
            </p>
          </div>
        )}
        <Button
          onClick={handleButtonClick}
          className="w-full flex items-center gap-2 dark:bg-white dark:hover:bg-gray-200"
        >
          <Pencil className="w-4 h-4" /> {editMode ? "Save" : "Edit Profile"}
        </Button>
      </div>
    </div>
  );
}
