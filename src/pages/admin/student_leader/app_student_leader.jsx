import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../../api/login_api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faDoorOpen,
  faFile,
  faGears,
  faHome,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import OverviewContent from "./overview_headboard";

export default function StudentAdminSection() {
  const navigate = useNavigate();

  // Store the user object from localStorage
  const [storedUser, setStoredUser] = useState(null);
  const [activeContent, setActiveContent] = useState("documents");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.organization) {
      navigate("/login");
      return;
    }
    setStoredUser(user);
  }, [navigate]);

  // Decide what to render for the main content area
  const renderContent = () => {
    // 1) If accreditation is pending, show the “pending” screen:
    if (storedUser.organization.accreditation_overall === "pending") {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Accreditation Status: <span className="text-red-600">Pending</span>
          </h2>
          <p className="text-gray-600 mb-4">
            Your organization's accreditation is currently pending. Please wait
            for further updates or contact the administrator if you have
            questions.
          </p>
          <div className="bg-gray-100 p-6 rounded-md border">
            <h3 className="text-xl font-bold mb-2">Organization Details</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Organization Name:</strong>{" "}
                {storedUser.organization.org_name}
              </li>
              <li>
                <strong>Acronym:</strong> {storedUser.organization.org_acronym}
              </li>
              <li>
                <strong>President:</strong>{" "}
                {storedUser.organization.org_president}
              </li>
              <li>
                <strong>Adviser:</strong> {storedUser.organization.adviser_name}
              </li>
              <li>
                <strong>Adviser Email:</strong>{" "}
                {storedUser.organization.adviser_email}
              </li>
              <li>
                <strong>Department:</strong>{" "}
                {storedUser.organization.adviser_department}
              </li>
              <li>
                <strong>Org Email:</strong> {storedUser.organization.org_email}
              </li>
              {/* You can add any other relevant fields here */}
            </ul>
          </div>
        </div>
      );
    }

    // 2) Otherwise, render normal content:
    switch (activeContent) {
      case "home":
        return <OverviewContent />;
      case "documents":
        return <div className="p-4">This is documents content</div>;
      case "post":
        return <div className="p-4">This is posts content</div>;
      case "settings":
        return <div className="p-4">This is settings content</div>;
      default:
        return <div className="p-4">Invalid selection</div>;
    }
  };

  // Handle navigation click
  const handleClick = (content) => {
    setActiveContent(content);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="h-auto flex gap-4 items-center px-8 py-4 text-white bg-cnsc-primary-color">
        <img src="/general/cnsc_codex_ver_2.png" className="h-20" alt="Logo" />
        <h1 className="text-2xl font-bold text-cnsc-white">
          Welcome Student Leader
        </h1>
      </div>

      {/* Main Layout */}
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-1/4 bg-cnsc-white border-r-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4 items-center p-6 text-black">
            <div
              className="w-full text-2xl bg-white p-4 rounded-lg cursor-pointer"
              onClick={() => handleClick("home")}
            >
              <FontAwesomeIcon icon={faHome} className="mr-4" />
              Overview
            </div>
            <div
              className="w-full text-2xl bg-white p-4 rounded-lg cursor-pointer"
              onClick={() => handleClick("documents")}
            >
              <FontAwesomeIcon icon={faFile} className="mr-4" />
              Documents
            </div>
            <div
              className="w-full text-2xl bg-white p-4 rounded-lg cursor-pointer"
              onClick={() => handleClick("post")}
            >
              <FontAwesomeIcon icon={faAdd} className="mr-4" />
              Post
            </div>
            <div
              className="w-full text-2xl bg-white p-4 rounded-lg cursor-pointer"
              onClick={() => handleClick("settings")}
            >
              <FontAwesomeIcon icon={faGears} className="mr-4" />
              Settings
            </div>
            <div
              className="w-full text-2xl bg-white p-4 rounded-lg cursor-pointer"
              onClick={() => handleLogout()}
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="mr-4" />
              Logout
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full p-6">
          {storedUser ? renderContent() : <p>Loading content...</p>}
        </div>
      </div>
    </div>
  );
}
