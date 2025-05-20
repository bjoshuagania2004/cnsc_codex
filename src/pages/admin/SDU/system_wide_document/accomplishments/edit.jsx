import { useState, useEffect } from "react";
import axios from "axios";
import { API_ROUTER } from "../../../../../App";
import { FileRenderer } from "../../../../../components/file_renderer";
import { PopUp } from "../../../../../components/pop-ups";

// Common FormSection component to reduce repetition
function FormSection({
  label,
  files,
  docStatus,
  revisionNotes,
  handleChange,
  basePath,
  docKey,
}) {
  if (files.length === 0 || !files[0]) {
    return (
      <div className="mb-6 border-b pb-2">
        <h3 className="font-semibold text-gray-700">{label}</h3>
        <p className="italic text-gray-500 text-sm">No documents uploaded</p>
      </div>
    );
  }

  return (
    <section className="mb-8 border rounded-lg shadow-sm overflow-hidden bg-white">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="font-semibold text-lg text-gray-800">{label}</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-4">
        <div className="flex-1">
          <div className="mb-4">
            <div className="flex items-center space-x-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={`${docKey}Status`}
                  value="approved"
                  checked={docStatus[docKey] === "approved"}
                  onChange={() => handleChange(docKey, "status", "approved")}
                  className="w-4 h-4 text-green-600"
                />
                <span className="ml-2 text-gray-800">Approved</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={`${docKey}Status`}
                  value="revision"
                  checked={docStatus[docKey] === "revision"}
                  className="w-4 h-4 text-amber-600"
                  onChange={() => handleChange(docKey, "status", "revision")}
                />
                <span className="ml-2 text-gray-800">Needs Revision</span>
              </label>
            </div>
          </div>

          {/* Revision notes section */}
          {(docStatus[docKey] === "revision" || revisionNotes[docKey]) && (
            <div className="mt-3 bg-gray-50 rounded-md border p-1">
              <textarea
                className="w-full rounded bg-white p-3 border border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows={3}
                placeholder="Please provide detailed feedback for revision..."
                value={revisionNotes[docKey]}
                onChange={(e) => handleChange(docKey, "note", e.target.value)}
              />
              {docStatus[docKey] !== "revision" && revisionNotes[docKey] && (
                <p className="text-amber-600 text-sm mt-1 px-2">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
                  Previous revision note is displayed. Status is now approved.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="md:w-1/2 lg:w-2/5 border rounded-lg overflow-hidden bg-gray-50 shadow-inner flex items-center justify-center">
          <div className="w-full max-h-64 overflow-auto p-2">
            {files.map((file, i) => (
              <FileRenderer key={i} basePath={basePath} fileName={file} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Common Header component
function AccomplishmentHeader({ title, type, description, date, status }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 pb-2 border-b">
        {title || "N/A"}
      </h2>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="w-28 font-medium text-gray-600">Activity Type:</div>
            <div className="font-semibold text-gray-800">{type || "N/A"}</div>
          </div>
          <div className="flex items-center">
            <div className="w-28 font-medium text-gray-600">Event Date:</div>
            <div className="font-semibold text-gray-800">
              {date
                ? new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-28 font-medium text-gray-600">
              Current Status:
            </div>
            <div className="font-semibold">
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm ${
                  status?.includes("Approved")
                    ? "bg-green-100 text-green-800"
                    : status?.includes("Revision")
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {status || "Pending"}
              </span>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="font-medium text-gray-600 mb-1">Description:</div>
            <div className="text-gray-800">{description || "N/A"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Common Form Footer
function FormFooter({ loading, onBack, isAllApproved }) {
  return (
    <div className="flex justify-end gap-4 pt-6 mt-8 border-t">
      <button
        type="button"
        onClick={onBack}
        disabled={loading}
        className="px-5 py-2.5 bg-gray-200 rounded-md hover:bg-gray-300 transition font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        Back
      </button>
      <button
        type="submit"
        disabled={loading}
        className={`px-5 py-2.5 rounded-md transition font-medium focus:outline-none focus:ring-2 ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : isAllApproved()
            ? "bg-green-600 hover:bg-green-700 text-white focus:ring-green-400"
            : "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-300"
        }`}
      >
        {loading
          ? "Submitting..."
          : isAllApproved()
          ? "Approve Documents"
          : "Send Revision Request"}
      </button>
    </div>
  );
}

function EditInstitutionalAccomplishmentAdviser({ accomplishment, onBack }) {
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, title: "", text: "" });

  // basePath to access files, encode URI components to avoid malformed URLs
  const basePath = `/${accomplishment.organization?.org_name}/InstitutionalAccomplishment/${accomplishment.event_title}`;

  // Create helper functions to safely check if documents exist
  const documentExists = (doc) => {
    return doc !== undefined && doc !== null && doc !== "";
  };

  const hasDocuments = (docArray) => {
    return Array.isArray(docArray) && docArray.length > 0;
  };

  // Initialize statuses based on existing statuses in accomplishment or fallback to 'pending'
  const initialStatus = {
    narrative:
      accomplishment.documents?.narrative_status ||
      (documentExists(accomplishment.documents?.narrative_report)
        ? "pending"
        : null),

    attendance:
      accomplishment.documents?.attendance_status ||
      (documentExists(accomplishment.documents?.attendance_sheet)
        ? "pending"
        : null),

    documentation:
      accomplishment.documents?.documentation_status ||
      (hasDocuments(accomplishment.documents?.photo_documentation)
        ? "pending"
        : null),

    certificate:
      accomplishment.documents?.certificate_status ||
      (hasDocuments(accomplishment.documents?.certificate) ? "pending" : null),
  };

  // Initialize revision notes based on existing notes, fallback to empty string
  const initialNotes = {
    narrative: accomplishment.documents?.narrative_notes || "",
    attendance: accomplishment.documents?.attendance_notes || "",
    documentation: accomplishment.documents?.documentation_notes || "",
    certificate: accomplishment.documents?.certificate_notes || "",
  };

  const [docStatus, setDocStatus] = useState(initialStatus);
  const [revisionNotes, setRevisionNotes] = useState(initialNotes);

  // If accomplishment changes, update states accordingly
  useEffect(() => {
    setDocStatus({
      narrative:
        accomplishment.documents?.narrative_status ||
        (documentExists(accomplishment.documents?.narrative_report)
          ? "pending"
          : null),

      attendance:
        accomplishment.documents?.attendance_status ||
        (documentExists(accomplishment.documents?.attendance_sheet)
          ? "pending"
          : null),

      documentation:
        accomplishment.documents?.documentation_status ||
        (hasDocuments(accomplishment.documents?.photo_documentation)
          ? "pending"
          : null),

      certificate:
        accomplishment.documents?.certificate_status ||
        (hasDocuments(accomplishment.documents?.certificate)
          ? "pending"
          : null),
    });

    setRevisionNotes({
      narrative: accomplishment.documents?.narrative_notes || "",
      attendance: accomplishment.documents?.attendance_notes || "",
      documentation: accomplishment.documents?.documentation_notes || "",
      certificate: accomplishment.documents?.certificate_notes || "",
    });
  }, [accomplishment]);

  const documentsConfig = [
    {
      key: "narrative",
      label: "Narrative Report",
      files: documentExists(accomplishment.documents?.narrative_report)
        ? [accomplishment.documents.narrative_report]
        : [],
    },
    {
      key: "attendance",
      label: "Attendance Sheet",
      files: documentExists(accomplishment.documents?.attendance_sheet)
        ? [accomplishment.documents.attendance_sheet]
        : [],
    },
    {
      key: "documentation",
      label: "Photo Documentation",
      files: hasDocuments(accomplishment.documents?.photo_documentation)
        ? accomplishment.documents.photo_documentation
        : [],
    },
    {
      key: "certificate",
      label: "Certificates",
      files: hasDocuments(accomplishment.documents?.certificate)
        ? accomplishment.documents.certificate
        : [],
    },
  ];

  const isAllApproved = () => {
    // Get all non-null statuses
    const activeDocuments = documentsConfig.filter(
      (doc) => doc.files.length > 0
    );
    if (activeDocuments.length === 0) return false;

    // Check if all active documents are approved
    return activeDocuments.every((doc) => docStatus[doc.key] === "approved");
  };

  const handleChange = (key, type, value) => {
    if (type === "status") {
      setDocStatus((prev) => ({ ...prev, [key]: value }));
      // Clear notes when status changes to approved
      if (value === "approved") {
        setRevisionNotes((prev) => ({ ...prev, [key]: "" }));
      }
    } else if (type === "note") {
      setRevisionNotes((prev) => ({ ...prev, [key]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create update object that matches the expected structure
    const documentUpdates = {};

    // Add status and notes fields directly to the documents object
    Object.entries(docStatus).forEach(([key, status]) => {
      if (status !== null) {
        documentUpdates[`${key}_status`] = status;
        documentUpdates[`${key}_notes`] = revisionNotes[key];
      }
    });

    // Keep existing document references
    if (accomplishment.documents?.narrative_report) {
      documentUpdates.narrative_report =
        accomplishment.documents.narrative_report;
    }

    if (accomplishment.documents?.attendance_sheet) {
      documentUpdates.attendance_sheet =
        accomplishment.documents.attendance_sheet;
    }

    if (hasDocuments(accomplishment.documents?.photo_documentation)) {
      documentUpdates.photo_documentation =
        accomplishment.documents.photo_documentation;
    }

    if (hasDocuments(accomplishment.documents?.certificate)) {
      documentUpdates.certificate = accomplishment.documents.certificate;
    }

    const body = {
      accomplishmentId: accomplishment._id,
      over_all_status: isAllApproved()
        ? "Approved by the SDU"
        : "Revision from the SDU",
      documents: documentUpdates,
    };

    try {
      const res = await axios.post(
        `${API_ROUTER}/update-institutional-accomplishment/adviser/${accomplishment._id}`,
        body
      );
      setPopup({
        visible: true,
        title: "Success",
        text: "Your changes have been submitted successfully.",
        ButtonText: "Okay",
      });
    } catch (err) {
      setPopup({
        visible: true,
        title: "Error",
        text: err.response?.data?.message || "Something went wrong.",
        ButtonText: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-sm mx-auto max-w-6xl"
    >
      {popup.visible && (
        <PopUp
          {...popup}
          onClose={() => {
            setPopup((p) => ({ ...p, visible: false }));
            if (popup.title === "Success") onBack();
          }}
        />
      )}

      <AccomplishmentHeader
        title={`Institutional Accomplishment: ${
          accomplishment.event_title || "N/A"
        }`}
        type={accomplishment.activity_type || "N/A"}
        description={accomplishment.event_description || "N/A"}
        date={accomplishment.event_date}
        status={accomplishment.over_all_status || "Pending"}
      />

      <div className="divide-y divide-gray-200">
        {documentsConfig.map(({ key, label, files }) => (
          <FormSection
            key={key}
            docKey={key}
            label={label}
            files={files}
            docStatus={docStatus}
            revisionNotes={revisionNotes}
            handleChange={handleChange}
            basePath={basePath}
          />
        ))}
      </div>

      <FormFooter
        loading={loading}
        onBack={onBack}
        isAllApproved={isAllApproved}
      />
    </form>
  );
}

function EditExternalAccomplishmentAdviser({ accomplishment, onBack }) {
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, title: "", text: "" });

  // basePath to access files, encode URI components to avoid malformed URLs
  const basePath = `/${accomplishment.organization?.org_name}/ExternalAccomplishment/${accomplishment.event_title}`;

  // Create a helper function to safely check if a document exists
  const documentExists = (docPath) => {
    return docPath !== undefined && docPath !== null;
  };

  const hasDocuments = (docArray) => {
    return Array.isArray(docArray) && docArray.length > 0;
  };

  // Initialize statuses based on existing statuses in accomplishment or fallback to 'pending' or null
  const initialStatus = {
    official_invitation:
      accomplishment.documents?.official_invitation_status ||
      (documentExists(accomplishment.documents?.official_invitation)
        ? "pending"
        : null),

    narrative_report:
      accomplishment.documents?.narrative_report_status ||
      (documentExists(accomplishment.documents?.narrative_report)
        ? "pending"
        : null),

    liquidation_report:
      accomplishment.documents?.liquidation_report_status ||
      (documentExists(accomplishment.documents?.liquidation_report)
        ? "pending"
        : null),

    photo_documentation:
      accomplishment.documents?.photo_documentation_status ||
      (hasDocuments(accomplishment.documents?.photo_documentation)
        ? "pending"
        : null),

    cm063_documents:
      accomplishment.documents?.cm063_documents_status ||
      (hasDocuments(accomplishment.documents?.cm063_documents)
        ? "pending"
        : null),

    echo_seminar_documents:
      accomplishment.documents?.echo_seminar_documents_status ||
      (hasDocuments(accomplishment.documents?.echo_seminar_documents)
        ? "pending"
        : null),
  };

  // Initialize revision notes based on existing notes, fallback to empty string
  const initialNotes = {
    official_invitation:
      accomplishment.documents?.official_invitation_notes || "",
    narrative_report: accomplishment.documents?.narrative_report_notes || "",
    liquidation_report:
      accomplishment.documents?.liquidation_report_notes || "",
    photo_documentation:
      accomplishment.documents?.photo_documentation_notes || "",
    cm063_documents: accomplishment.documents?.cm063_documents_notes || "",
    echo_seminar_documents:
      accomplishment.documents?.echo_seminar_documents_notes || "",
  };

  const [docStatus, setDocStatus] = useState(initialStatus);
  const [revisionNotes, setRevisionNotes] = useState(initialNotes);

  // If accomplishment changes, update states accordingly
  useEffect(() => {
    setDocStatus({
      official_invitation:
        accomplishment.documents?.official_invitation_status ||
        (documentExists(accomplishment.documents?.official_invitation)
          ? "pending"
          : null),

      narrative_report:
        accomplishment.documents?.narrative_report_status ||
        (documentExists(accomplishment.documents?.narrative_report)
          ? "pending"
          : null),

      liquidation_report:
        accomplishment.documents?.liquidation_report_status ||
        (documentExists(accomplishment.documents?.liquidation_report)
          ? "pending"
          : null),

      photo_documentation:
        accomplishment.documents?.photo_documentation_status ||
        (hasDocuments(accomplishment.documents?.photo_documentation)
          ? "pending"
          : null),

      cm063_documents:
        accomplishment.documents?.cm063_documents_status ||
        (hasDocuments(accomplishment.documents?.cm063_documents)
          ? "pending"
          : null),

      echo_seminar_documents:
        accomplishment.documents?.echo_seminar_documents_status ||
        (hasDocuments(accomplishment.documents?.echo_seminar_documents)
          ? "pending"
          : null),
    });

    setRevisionNotes({
      official_invitation:
        accomplishment.documents?.official_invitation_notes || "",
      narrative_report: accomplishment.documents?.narrative_report_notes || "",
      liquidation_report:
        accomplishment.documents?.liquidation_report_notes || "",
      photo_documentation:
        accomplishment.documents?.photo_documentation_notes || "",
      cm063_documents: accomplishment.documents?.cm063_documents_notes || "",
      echo_seminar_documents:
        accomplishment.documents?.echo_seminar_documents_notes || "",
    });
  }, [accomplishment]);

  const documentsConfig = [
    {
      key: "official_invitation",
      label: "Official Invitation",
      files: documentExists(accomplishment.documents?.official_invitation)
        ? [accomplishment.documents.official_invitation]
        : [],
    },
    {
      key: "narrative_report",
      label: "Narrative Report",
      files: documentExists(accomplishment.documents?.narrative_report)
        ? [accomplishment.documents.narrative_report]
        : [],
    },
    {
      key: "liquidation_report",
      label: "Liquidation Report",
      files: documentExists(accomplishment.documents?.liquidation_report)
        ? [accomplishment.documents.liquidation_report]
        : [],
    },
    {
      key: "photo_documentation",
      label: "Photo Documentation",
      files: hasDocuments(accomplishment.documents?.photo_documentation)
        ? accomplishment.documents.photo_documentation
        : [],
    },
    {
      key: "cm063_documents",
      label: "CMO 63 Documents",
      files: hasDocuments(accomplishment.documents?.cm063_documents)
        ? accomplishment.documents.cm063_documents
        : [],
    },
    {
      key: "echo_seminar_documents",
      label: "Echo Seminar Documents",
      files: hasDocuments(accomplishment.documents?.echo_seminar_documents)
        ? accomplishment.documents.echo_seminar_documents
        : [],
    },
  ];

  const isAllApproved = () => {
    const statuses = Object.entries(docStatus)
      .filter(([_, status]) => status !== null)
      .map(([_, status]) => status);
    if (statuses.length === 0) return false;
    return statuses.every((status) => status === "approved");
  };

  const handleChange = (key, type, value) => {
    if (type === "status") {
      setDocStatus((prev) => ({ ...prev, [key]: value }));
      // Clear notes when status changes to approved
      if (value === "approved") {
        setRevisionNotes((prev) => ({ ...prev, [key]: "" }));
      }
    } else if (type === "note") {
      setRevisionNotes((prev) => ({ ...prev, [key]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const statusEntries = Object.entries(docStatus)
      .filter(([_, status]) => status !== null)
      .flatMap(([key, status]) => [
        [`${key}_status`, status],
        [`${key}_notes`, revisionNotes[key]],
      ]);

    const body = {
      accomplishmentId: accomplishment._id,
      over_all_status: isAllApproved()
        ? "Approved by the SDU"
        : "Revision from the SDU",
      documents: {
        ...Object.fromEntries(statusEntries),
      },
    };

    try {
      const res = await axios.post(
        `${API_ROUTER}/update-external-accomplishment/adviser/${accomplishment._id}`,
        body
      );
      setPopup({
        visible: true,
        title: "Success",
        text: "Your changes have been submitted successfully.",
        ButtonText: "Okay",
      });
    } catch (err) {
      setPopup({
        visible: true,
        title: "Error",
        text: err.response?.data?.message || "Something went wrong.",
        ButtonText: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-sm mx-auto max-w-6xl"
    >
      {popup.visible && (
        <PopUp
          {...popup}
          onClose={() => {
            setPopup((p) => ({ ...p, visible: false }));
            if (popup.title === "Success") onBack();
          }}
        />
      )}

      <AccomplishmentHeader
        title={`External Accomplishment: ${
          accomplishment.event_title || "N/A"
        }`}
        type="External"
        description={accomplishment.event_description || "N/A"}
        date={accomplishment.event_date}
        status={accomplishment.over_all_status || "Pending"}
      />

      <div className="divide-y divide-gray-200">
        {documentsConfig.map(({ key, label, files }) => (
          <FormSection
            key={key}
            docKey={key}
            label={label}
            files={files}
            docStatus={docStatus}
            revisionNotes={revisionNotes}
            handleChange={handleChange}
            basePath={basePath}
          />
        ))}
      </div>

      <FormFooter
        loading={loading}
        onBack={onBack}
        isAllApproved={isAllApproved}
      />
    </form>
  );
}

function EditProposedPlanAccomplishmentAdviser({ accomplishment, onBack }) {
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, title: "", text: "" });

  // basePath to access files, encode URI components to avoid malformed URLs
  const basePath = `/${accomplishment.organization?.org_name}/ProposedActivity/${accomplishment.event_title}`;

  // Create a helper function to safely check if a document exists
  const documentExists = (docPath) => {
    return docPath !== undefined && docPath !== null;
  };

  const hasDocuments = (docArray) => {
    return Array.isArray(docArray) && docArray.length > 0;
  };

  // Initialize statuses based on existing statuses in accomplishment or fallback to 'pending' or null
  const initialStatus = {
    approved_proposal:
      accomplishment.documents?.approved_proposal_status ||
      (documentExists(accomplishment.documents?.approved_proposal)
        ? "pending"
        : null),

    resolution:
      accomplishment.documents?.resolution_status ||
      (documentExists(accomplishment.documents?.resolution) ? "pending" : null),

    attendance_sheet:
      accomplishment.documents?.attendance_sheet_status ||
      (documentExists(accomplishment.documents?.attendance_sheet)
        ? "pending"
        : null),

    narrative_report:
      accomplishment.documents?.narrative_report_status ||
      (documentExists(accomplishment.documents?.narrative_report)
        ? "pending"
        : null),

    financial_report:
      accomplishment.documents?.financial_report_status ||
      (documentExists(accomplishment.documents?.financial_report)
        ? "pending"
        : null),

    evaluation_summary:
      accomplishment.documents?.evaluation_summary_status ||
      (documentExists(accomplishment.documents?.evaluation_summary)
        ? "pending"
        : null),

    photo_documentation:
      accomplishment.documents?.photo_documentation_status ||
      (hasDocuments(accomplishment.documents?.photo_documentation)
        ? "pending"
        : null),

    sample_evaluations:
      accomplishment.documents?.sample_evaluations_status ||
      (hasDocuments(accomplishment.documents?.sample_evaluations)
        ? "pending"
        : null),
  };

  // Initialize revision notes based on existing notes, fallback to empty string
  const initialNotes = {
    approved_proposal: accomplishment.documents?.approved_proposal_notes || "",
    resolution: accomplishment.documents?.resolution_notes || "",
    attendance_sheet: accomplishment.documents?.attendance_sheet_notes || "",
    narrative_report: accomplishment.documents?.narrative_report_notes || "",
    financial_report: accomplishment.documents?.financial_report_notes || "",
    evaluation_summary:
      accomplishment.documents?.evaluation_summary_notes || "",
    photo_documentation:
      accomplishment.documents?.photo_documentation_notes || "",
    sample_evaluations:
      accomplishment.documents?.sample_evaluations_notes || "",
  };

  const [docStatus, setDocStatus] = useState(initialStatus);
  const [revisionNotes, setRevisionNotes] = useState(initialNotes);

  // If accomplishment changes, update states accordingly
  useEffect(() => {
    setDocStatus({
      approved_proposal:
        accomplishment.documents?.approved_proposal_status ||
        (documentExists(accomplishment.documents?.approved_proposal)
          ? "pending"
          : null),

      resolution:
        accomplishment.documents?.resolution_status ||
        (documentExists(accomplishment.documents?.resolution)
          ? "pending"
          : null),

      attendance_sheet:
        accomplishment.documents?.attendance_sheet_status ||
        (documentExists(accomplishment.documents?.attendance_sheet)
          ? "pending"
          : null),

      narrative_report:
        accomplishment.documents?.narrative_report_status ||
        (documentExists(accomplishment.documents?.narrative_report)
          ? "pending"
          : null),

      financial_report:
        accomplishment.documents?.financial_report_status ||
        (documentExists(accomplishment.documents?.financial_report)
          ? "pending"
          : null),

      evaluation_summary:
        accomplishment.documents?.evaluation_summary_status ||
        (documentExists(accomplishment.documents?.evaluation_summary)
          ? "pending"
          : null),

      photo_documentation:
        accomplishment.documents?.photo_documentation_status ||
        (hasDocuments(accomplishment.documents?.photo_documentation)
          ? "pending"
          : null),

      sample_evaluations:
        accomplishment.documents?.sample_evaluations_status ||
        (hasDocuments(accomplishment.documents?.sample_evaluations)
          ? "pending"
          : null),
    });

    setRevisionNotes({
      approved_proposal:
        accomplishment.documents?.approved_proposal_notes || "",
      resolution: accomplishment.documents?.resolution_notes || "",
      attendance_sheet: accomplishment.documents?.attendance_sheet_notes || "",
      narrative_report: accomplishment.documents?.narrative_report_notes || "",
      financial_report: accomplishment.documents?.financial_report_notes || "",
      evaluation_summary:
        accomplishment.documents?.evaluation_summary_notes || "",
      photo_documentation:
        accomplishment.documents?.photo_documentation_notes || "",
      sample_evaluations:
        accomplishment.documents?.sample_evaluations_notes || "",
    });
  }, [accomplishment]);

  const documentsConfig = [
    {
      key: "approved_proposal",
      label: "Approved Proposal",
      files: documentExists(accomplishment.documents?.approved_proposal)
        ? [accomplishment.documents.approved_proposal]
        : [],
    },
    {
      key: "resolution",
      label: "Resolution",
      files: documentExists(accomplishment.documents?.resolution)
        ? [accomplishment.documents.resolution]
        : [],
    },
    {
      key: "attendance_sheet",
      label: "Attendance Sheet",
      files: documentExists(accomplishment.documents?.attendance_sheet)
        ? [accomplishment.documents.attendance_sheet]
        : [],
    },
    {
      key: "narrative_report",
      label: "Narrative Report",
      files: documentExists(accomplishment.documents?.narrative_report)
        ? [accomplishment.documents.narrative_report]
        : [],
    },
    {
      key: "financial_report",
      label: "Financial Report",
      files: documentExists(accomplishment.documents?.financial_report)
        ? [accomplishment.documents.financial_report]
        : [],
    },
    {
      key: "evaluation_summary",
      label: "Evaluation Summary",
      files: documentExists(accomplishment.documents?.evaluation_summary)
        ? [accomplishment.documents.evaluation_summary]
        : [],
    },
    {
      key: "photo_documentation",
      label: "Photo Documentation",
      files: hasDocuments(accomplishment.documents?.photo_documentation)
        ? accomplishment.documents.photo_documentation
        : [],
    },
    {
      key: "sample_evaluations",
      label: "Sample Evaluations",
      files: hasDocuments(accomplishment.documents?.sample_evaluations)
        ? accomplishment.documents.sample_evaluations
        : [],
    },
  ];

  const isAllApproved = () => {
    const statuses = Object.entries(docStatus)
      .filter(([_, status]) => status !== null)
      .map(([_, status]) => status);
    if (statuses.length === 0) return false;
    return statuses.every((status) => status === "approved");
  };

  const handleChange = (key, type, value) => {
    if (type === "status") {
      setDocStatus((prev) => ({ ...prev, [key]: value }));
      // Clear notes when status changes to approved
      if (value === "approved") {
        setRevisionNotes((prev) => ({ ...prev, [key]: "" }));
      }
    } else if (type === "note") {
      setRevisionNotes((prev) => ({ ...prev, [key]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const statusEntries = Object.entries(docStatus)
      .filter(([_, status]) => status !== null)
      .flatMap(([key, status]) => [
        [`${key}_status`, status],
        [`${key}_notes`, revisionNotes[key]],
      ]);

    const body = {
      accomplishmentId: accomplishment._id,
      over_all_status: isAllApproved()
        ? "Approved by the SDU"
        : "Revision from the SDU",
      documents: {
        ...Object.fromEntries(statusEntries),
      },
    };
    console.log(body);

    try {
      const res = await axios.post(
        `${API_ROUTER}/update-proposed-accomplishment/adviser/${accomplishment._id}`,
        body
      );
      setPopup({
        visible: true,
        title: "Change Submitted",
        text: "Your changes have been submitted successfully.",
        ButtonText: "Okay",
      });
    } catch (err) {
      setPopup({
        visible: true,
        title: "Error",
        text: err.response?.data?.message || "Something went wrong.",
        ButtonText: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white p-4  mx-auto">
      {popup.visible && (
        <PopUp
          {...popup}
          onClose={() => setPopup((p) => ({ ...p, visible: false }))}
        />
      )}

      <h2 className="text-2xl font-bold text-center">{`Proposed Plan: ${
        accomplishment.event_title || "N/A"
      }`}</h2>
      <p className="text-lg">
        Activity Type: Proposed Plan <br />
        Description: {accomplishment.event_description || "N/A"} <br />
        Event Date:{" "}
        {accomplishment.event_date
          ? new Date(accomplishment.event_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A"}
        <br />
        Current Status: {accomplishment.over_all_status || "Pending"}
      </p>

      {documentsConfig.map(({ key, label, files }) => (
        <section key={key} className="mb-4 flex flex-col">
          {files.length > 0 && files[0] ? (
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">{label}</h3>
              <div className="flex bg-gray-200 items-start shadow-lg p-2 rounded-lg flex-1 gap-4">
                <div className="flex-1">
                  <div className="flex">
                    <label className="mr-4">
                      <input
                        type="radio"
                        name={`${key}Status`}
                        value="approved"
                        checked={docStatus[key] === "approved"}
                        onChange={() => handleChange(key, "status", "approved")}
                        className="mr-2"
                      />
                      Approved
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`${key}Status`}
                        value="revision"
                        checked={docStatus[key] === "revision"}
                        className="mr-2"
                        onChange={() => handleChange(key, "status", "revision")}
                      />
                      Revision
                    </label>
                  </div>
                  <div className="flex-1">
                    {/* Always show textarea if there are notes or status is revision */}
                    {(docStatus[key] === "revision" || revisionNotes[key]) && (
                      <div className="mt-2">
                        <textarea
                          className="w-full rounded bg-gray-50 p-4"
                          rows={3}
                          placeholder="Reason for revision"
                          value={revisionNotes[key]}
                          onChange={(e) =>
                            handleChange(key, "note", e.target.value)
                          }
                        />
                        {docStatus[key] !== "revision" &&
                          revisionNotes[key] && (
                            <p className="text-amber-600 text-sm mt-1">
                              Previous revision note displayed. Status is now
                              approved.
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1/2 flex shrink-0 overflow-auto">
                  {files.map((file, i) => (
                    <FileRenderer key={i} basePath={basePath} fileName={file} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="italic text-sm">None</p>
          )}
        </section>
      ))}

      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded transition ${
            isAllApproved()
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
        >
          {loading
            ? "Submitting..."
            : isAllApproved()
            ? "Approve"
            : "Send Revision"}
        </button>
      </div>
    </form>
  );
}

export default function SduAccomplishmentApprovalEdit({
  selectedAccomplishment,
  onBack,
}) {
  console.log();
  console.log("selected Accomplishment", selectedAccomplishment.activity_type);

  const activityType = selectedAccomplishment.activity_type;

  return (
    <div className=" flex  flex-col h-full overflow-auto">
      {activityType === "Institutional" && (
        <EditInstitutionalAccomplishmentAdviser
          accomplishment={selectedAccomplishment}
          onBack={onBack}
        />
      )}
      {activityType === "External" && (
        <EditExternalAccomplishmentAdviser
          accomplishment={selectedAccomplishment}
          onBack={onBack}
        />
      )}
      {activityType === "Proposed Plan" && (
        <EditProposedPlanAccomplishmentAdviser
          accomplishment={selectedAccomplishment}
          onBack={onBack}
        />
      )}
    </div>
  );
}
