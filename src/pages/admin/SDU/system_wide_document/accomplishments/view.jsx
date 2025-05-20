import { useState, useEffect } from "react";
import axios from "axios";
import { API_ROUTER } from "../../../../../App";
import { faPen, faTimes, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SduAccomplishmentApprovalEdit from "./edit";

// Helper function for date formatting
function LongDateFormat(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PopupModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
      <div className="relative bg-white rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-auto">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function SDuAccomplishmentsTable({ editAccomplishment }) {
  const [accomplishmentsList, setAccomplishmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch accomplishments data
    const fetchAccomplishments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_ROUTER}/system-wide-accomplishments`
        );

        const {
          InstitutionalActivity = [],
          ExternalActivity = [],
          ProposedActivity = [],
        } = response.data;

        const allActivities = [
          ...InstitutionalActivity,
          ...ExternalActivity,
          ...ProposedActivity,
        ];

        setAccomplishmentsList(allActivities);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch accomplishments data");
      } finally {
        setLoading(false);
      }
    };

    fetchAccomplishments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading accomplishments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  const getStatusStyle = (status) => {
    if (status === "Approved by the Adviser") {
      return "bg-green-100 text-green-800";
    } else if (
      status === "Approved by the SDU" ||
      status === "Approved by the Dean"
    ) {
      return "bg-red-100 text-red-800";
    } else if (status === "Approved by the OSSD Coordinator") {
      return "bg-blue-100 text-blue-800";
    } else if (status === "Pending") {
      return "bg-yellow-100 text-yellow-800";
    } else if (status?.includes("Revision")) {
      return "bg-red-100 text-red-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen pb-8">
      <div className="bg-gray-900 text-white p-4">
        <h1 className="text-xl font-medium">Accomplishments</h1>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg mx-4 mt-4">
        <table className="min-w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left text-xs uppercase font-medium text-gray-600 tracking-wider">
                TITLE
              </th>
              <th className="py-3 px-4 text-left text-xs uppercase font-medium text-gray-600 tracking-wider">
                ORGANIZATION
              </th>
              <th className="py-3 px-4 text-left text-xs uppercase font-medium text-gray-600 tracking-wider">
                ACTIVITY TYPE
              </th>
              <th className="py-3 px-4 text-left text-xs uppercase font-medium text-gray-600 tracking-wider">
                EVENT DATE
              </th>
              <th className="py-3 px-4 text-left text-xs uppercase font-medium text-gray-600 tracking-wider">
                STATUS
              </th>
              <th className="py-3 px-4 text-left text-xs uppercase font-medium text-gray-600 tracking-wider">
                DESCRIPTION
              </th>
              <th className="py-3 px-4 text-left text-xs uppercase font-medium text-gray-600 tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {accomplishmentsList.length > 0 ? (
              accomplishmentsList.map((activity, index) => (
                <tr
                  key={activity._id || index}
                  className="border-b hover:bg-gray-50 bg-white"
                >
                  <td className="py-4 px-4 text-sm text-gray-800">
                    {activity.event_title || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-800">
                    {activity.organization?.org_name || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-800">
                    {activity.activity_type || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-800">
                    {activity.event_date
                      ? LongDateFormat(new Date(activity.event_date))
                      : "N/A"}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        activity.over_all_status
                      )}`}
                    >
                      {activity.over_all_status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-800 max-w-xs truncate">
                    {activity.event_description || "N/A"}
                  </td>
                  <td className="py-4 px-4 flex gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-green-600"
                      title="Edit"
                      onClick={() => editAccomplishment(activity)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-sm text-gray-500 italic"
                >
                  No accomplishments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SduAccomplishmentApprovalSection() {
  const [selectedAccomplishment, setSelectedAccomplishment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditAccomplishment = (accomplishment) => {
    setSelectedAccomplishment(accomplishment);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    // Optionally refresh the proposal list here
  };

  return (
    <>
      <SDuAccomplishmentsTable editAccomplishment={handleEditAccomplishment} />

      <PopupModal isOpen={isEditModalOpen} onClose={handleCloseModal}>
        {selectedAccomplishment && (
          <SduAccomplishmentApprovalEdit
            selectedAccomplishment={selectedAccomplishment}
            onBack={handleCloseModal}
          />
        )}
      </PopupModal>
    </>
  );
}
