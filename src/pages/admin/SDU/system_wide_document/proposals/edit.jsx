import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faPen,
  faTimes,
  faCheckCircle,
  faExclamationCircle,
  faFile,
  faFileAlt,
  faCamera,
  faClipboardList,
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";
import { API_ROUTER } from "../../../../../App";
import { FileRenderer } from "../../../../../components/file_renderer";

export default function SduProposalApprovalEdit({ user, proposal, onClose }) {
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    visible: false,
    title: "",
    text: "",
    isError: false,
  });

  const basePath = `/${proposal.organization.org_name}/Proposals/${proposal.title}`;

  const initialStatus = {
    proposal: "pending",
    notice: "pending",
    minutes: "pending",
    resolution: "pending",
    photo: "pending",
  };

  const initialNotes = {
    proposal: "",
    notice: "",
    minutes: "",
    resolution: "",
    photo: "",
  };

  const [docStatus, setDocStatus] = useState(initialStatus);
  const [revisionNotes, setRevisionNotes] = useState(initialNotes);
  const [activeSection, setActiveSection] = useState(null);

  // Add some CSS animations
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-in-out;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const documentsConfig = [
    {
      key: "proposal",
      label: "Proposal Document",
      icon: faFileAlt,
      files: [proposal.meeting.proposal_document],
    },
    {
      key: "notice",
      label: "Notice Document",
      icon: faFile,
      files: [proposal.meeting.notice_document],
    },
    {
      key: "minutes",
      label: "Minutes Document",
      icon: faClipboardList,
      files: [proposal.meeting.minutes_document],
    },
    {
      key: "resolution",
      label: "Resolution Documents",
      icon: faFileSignature,
      files: proposal.meeting.resolution_document || [],
    },
    {
      key: "photo",
      label: "Meeting's Photo Documentation",
      icon: faCamera,
      files: proposal.meeting.photo_documentations || [],
    },
  ];

  const isAllApproved = () =>
    Object.values(docStatus).every((status) => status === "approved");

  const handleChange = (key, type, value) => {
    if (type === "status") setDocStatus((prev) => ({ ...prev, [key]: value }));
    else setRevisionNotes((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (key) => {
    setActiveSection(activeSection === key ? null : key);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      proposalId: proposal._id,
      approval_status: isAllApproved()
        ? "Approved by the SDU"
        : "Revision from the SDU",
      meeting: {
        ...proposal.meeting,
        ...Object.fromEntries(
          Object.keys(docStatus).flatMap((key) => [
            [`${key}_document_status`, docStatus[key]],
            [`${key}_document_note`, revisionNotes[key]],
          ])
        ),
      },
    };

    try {
      const res = await axios.put(
        `${API_ROUTER}/update-proposals-adviser/${proposal._id}`,
        body
      );
      setPopup({
        visible: true,
        title: "Success!",
        text: "Your evaluation has been submitted successfully.",
        isError: false,
      });
      // Close the popup after successful submission
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setPopup({
        visible: true,
        title: "Error",
        text:
          err.response?.data?.message ||
          "Something went wrong while submitting your evaluation.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Simple popup component for notifications
  function PopUp({ visible, title, text, isError, onClose }) {
    if (!visible) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-xl animate-fadeIn">
          <div className="flex items-center mb-4">
            <div
              className={`mr-3 text-2xl ${
                isError ? "text-red-500" : "text-green-500"
              }`}
            >
              <FontAwesomeIcon
                icon={isError ? faExclamationCircle : faCheckCircle}
              />
            </div>
            <h3 className="font-bold text-xl">{title}</h3>
          </div>
          <p className="text-gray-700">{text}</p>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200 flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
            Approved
          </span>
        );
      case "revision":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center">
            <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
            Needs Revision
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {popup.visible && (
        <PopUp
          {...popup}
          onClose={() => setPopup((p) => ({ ...p, visible: false }))}
        />
      )}

      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{proposal.title}</h2>
        <div className="mt-2 text-gray-600">
          <p className="mb-1">
            <span className="font-medium">Description:</span>{" "}
            {proposal.description}
          </p>
          <p>
            <span className="font-medium">Event Date:</span>{" "}
            {new Date(proposal.event_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {documentsConfig.map(({ key, label, icon, files }) => (
          <div
            key={key}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
          >
            <div
              className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeSection === key ? "bg-blue-50 border-b" : ""
              }`}
              onClick={() => toggleSection(key)}
            >
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">
                  <FontAwesomeIcon icon={icon} />
                </div>
                <h3 className="font-semibold text-gray-800">{label}</h3>
                {docStatus[key] !== "pending" && getStatusBadge(docStatus[key])}
              </div>
              <div className="text-gray-500">
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`transform transition-transform ${
                    activeSection === key ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {activeSection === key && (
              <div className="p-4 bg-gray-50 border-t animate-fadeIn">
                {files.length > 0 && files[0] ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="mb-4">
                        <h4 className="font-medium mb-3 text-gray-700">
                          Evaluation Status
                        </h4>
                        <div className="flex flex-wrap gap-4">
                          <label
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md cursor-pointer transition-colors ${
                              docStatus[key] === "approved"
                                ? "bg-green-100 border border-green-300 ring-2 ring-green-200"
                                : "bg-white border hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`${key}Status`}
                              value="approved"
                              checked={docStatus[key] === "approved"}
                              onChange={() =>
                                handleChange(key, "status", "approved")
                              }
                              className="form-radio text-green-600"
                            />
                            <span
                              className={
                                docStatus[key] === "approved"
                                  ? "text-green-800 font-medium"
                                  : "text-gray-700"
                              }
                            >
                              Approve
                            </span>
                          </label>
                          <label
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md cursor-pointer transition-colors ${
                              docStatus[key] === "revision"
                                ? "bg-yellow-100 border border-yellow-300 ring-2 ring-yellow-200"
                                : "bg-white border hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`${key}Status`}
                              value="revision"
                              checked={docStatus[key] === "revision"}
                              onChange={() =>
                                handleChange(key, "status", "revision")
                              }
                              className="form-radio text-yellow-600"
                            />
                            <span
                              className={
                                docStatus[key] === "revision"
                                  ? "text-yellow-800 font-medium"
                                  : "text-gray-700"
                              }
                            >
                              Request Revision
                            </span>
                          </label>
                        </div>
                      </div>

                      {docStatus[key] === "revision" && (
                        <div className="border-t pt-4 mt-4 border-yellow-200">
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Revision Notes{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            className="w-full border border-yellow-200 rounded-md p-3 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition bg-yellow-50"
                            rows={3}
                            placeholder="Please provide detailed feedback about what needs to be revised"
                            value={revisionNotes[key]}
                            onChange={(e) =>
                              handleChange(key, "note", e.target.value)
                            }
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 text-gray-700">
                        Document Preview
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-auto p-2 bg-white rounded-lg border border-gray-200">
                        {files.map((file, i) => (
                          <div
                            key={i}
                            className="p-3 border border-gray-200 rounded-md hover:shadow-md transition"
                          >
                            <FileRenderer
                              key={i}
                              basePath={basePath}
                              fileName={file}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded p-4 border border-dashed border-gray-300 text-center">
                    <p className="text-gray-500">No documents available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end gap-4 pt-6 border-t mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              isAllApproved()
                ? "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                : "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500"
            } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : isAllApproved() ? (
              <span className="flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Approve Proposal
              </span>
            ) : (
              <span className="flex items-center">
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                Request Revisions
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
