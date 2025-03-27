import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Globe, User, CheckCircle, Clock, Info,Github } from "lucide-react";
import Link from "next/link";

const AnnouncementCard = ({ announcement }) => {
  return (
    <Card className="bg-black  text-white shadow-lg border border-white border-solid ">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {announcement.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-3">{announcement.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {announcement.requiredSkills.map((skill, index) => (
            <Badge key={index} className="bg-gray-700 text-gray-200">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            {announcement.deadline
              ? new Date(announcement.deadline).toDateString()
              : "No deadline"}
          </div>
          <div className="flex items-center gap-1">
            <User size={16} />
            {announcement.applicants.length}/{announcement.requiredNumber}{" "}
            Applicants
          </div>
          <div
            className={`flex items-center gap-1 ${
              announcement.isOpen ? "text-green-400" : "text-red-400"
            }`}
          >
            <CheckCircle size={16} />
            {announcement.isOpen ? "Open" : "Closed"}
          </div>
        </div>
        <div className="flex justify-between">
          {announcement.projectUrl && (
            <Link href={announcement.projectUrl} target="_blank">
              <Button
                variant="outline"
                className="text-gray-300 border-gray-600"
              >
                <Github size={16} className="mr-2" /> View Project
              </Button>
            </Link>
          )}
          {announcement.websiteUrl && (
            <Link href={announcement.websiteUrl} target="_blank">
              <Button
                variant="outline"
                className="text-gray-300 border-gray-600"
              >
                <Globe size={16} className="mr-2" /> Website
              </Button>
            </Link>
          )}
          {
            <Button
              variant="outline"
              className="cursor-pointer bg-white text-black"
            >
              <Info size={16} /> View Details
            </Button>
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
