import { useState } from "react";
import {
  FileUploadComponent,
  OrganizationComponent,
  ReviewComponent,
  EmailConfirmationComponent,
} from "./register_components";

import { API_ROUTER } from "/src/App.jsx";
import axios from "axios";

const fileFields = {
  "org logo": { label: "Organization Logo", accept: "photos/*" },

  "Constitution & By-laws": {
    label: "Constitution & By-laws",
    accept: ".pdf,.doc,.docx",
  },
  "Pledge Against Hazing": {
    label: "Pledge Against Hazing",
    accept: ".pdf,.doc,.docx",
  },

  Rosters: { label: "Rosters", accept: ".pdf,.doc,.docx" },
  "President Info Sheet": {
    label: "President Info Sheet",
    accept: ".pdf,.doc,.docx",
  },
  "Financial Report": { label: "Financial Report", accept: ".pdf,.doc,.docx" },
  "Collectible Fees": { label: "Collectible Fees", accept: ".pdf,.doc,.docx" },
  "Commitment Statement": {
    label: "Commitment Statement",
    accept: ".pdf,.doc,.docx",
  },
  Memorandum: { label: "Memorandum", accept: ".pdf,.doc,.docx" },
  "Action Plan": { label: "Action Plan", accept: ".pdf,.doc,.docx" },
};

export default function RegisterSection() {
  const steps = ["Organization", "File Upload", "Review", "Email confirmation"];
  const [registrationStep, setRegistrationStep] = useState(0);
  const [orgFormData, setOrgFormData] = useState({});
  const [documentFormData, setDocumentFormData] = useState({});

  // Move to the next step
  const handleNext = () => {
    if (registrationStep < steps.length - 1) {
      setRegistrationStep((prev) => prev + 1);
    }
  };

  // Organization Info submission
  const handleOrgInfoSubmit = (e) => {
    e.preventDefault();
    console.log("Organization Data:", orgFormData);
    handleNext();
  };

  // File Upload submission
  const handleFileUploadSubmit = (uploadedFiles, key) => {
    setDocumentFormData(uploadedFiles);
    console.log("Uploaded files:", uploadedFiles);
    handleNext();
  };

  // Allow returning to the Organization form for edits
  const handleEdit = () => setRegistrationStep(0);

  // Handler to update file names (if needed in your workflow)
  const handleFileNameUpdate = (key, fileName) => {
    setOrgRegistrationDataLoad((prev) => ({
      ...prev,
      org_documents: {
        ...prev.org_documents,
        [key]: fileName,
      },
    }));
  };

  // Final submission function (unchanged)
  const handleFinalSubmit = async () => {
    const formDataToSubmit = new FormData();

    // Append text fields from orgFormData
    formDataToSubmit.append("org_username", orgFormData.organizationUsername);
    formDataToSubmit.append("org_password", orgFormData.organizationPassword);
    formDataToSubmit.append("adviser_username", orgFormData.adviserUsername);
    formDataToSubmit.append("adviser_password", orgFormData.adviserPassword);
    formDataToSubmit.append("org_name", orgFormData.organizationName);
    formDataToSubmit.append("org_email", orgFormData.organizationEmail);
    formDataToSubmit.append("org_acronym", orgFormData.organizationAcronym);
    formDataToSubmit.append("org_class", orgFormData.classification);
    formDataToSubmit.append("org_president", orgFormData.organizationPresident);

    // Append classification-specific fields
    if (orgFormData.classification === "Local") {
      formDataToSubmit.append("department", orgFormData.department);
      formDataToSubmit.append("course", orgFormData.course);
    } else if (orgFormData.classification === "System-wide") {
      formDataToSubmit.append("specialization", orgFormData.specialization);
    }

    formDataToSubmit.append("adviser_name", orgFormData.adviserName);
    formDataToSubmit.append("adviser_email", orgFormData.adviserEmail);
    formDataToSubmit.append(
      "adviser_department",
      orgFormData.adviserDepartment
    );

    // Optionally append accreditation type if it exists
    if (orgFormData.accreditation_type) {
      formDataToSubmit.append(
        "accreditation_type",
        orgFormData.accreditation_type
      );
    }

    // Additional fields for folder and document classification
    formDataToSubmit.append("orgFolder", orgFormData.organizationName);
    formDataToSubmit.append("orgDocumentClassification", "Accreditation");

    // Append file fields from documentFormData
    Object.entries(documentFormData).forEach(([key, file]) => {
      if (file && file.type) {
        // Append based on file type
        if (file.type.startsWith("image/")) {
          formDataToSubmit.append("photo", file);
          console.log("Photo appended:", key);
        } else if (
          file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          formDataToSubmit.append("document", file);
          console.log("Document appended:", key);
        } else {
          // Fallback: append with the original key
          formDataToSubmit.append(key, file);
          console.log("Other file appended:", key);
        }
        // Optionally send file name along with the file
        formDataToSubmit.append(`${key}`, file.name);
      }
    });

    // Debug: log each FormData entry (for development purposes)
    for (let [key, value] of formDataToSubmit.entries()) {
      console.log(key, value);
    }
    console.log("Final Org Form Data:", orgFormData);

    // Submit the data using axios
    try {
      const response = await axios.post(
        `${API_ROUTER}/accredit`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        console.log("Submitted successfully!");
        alert("Submission successful!");
      } else {
        console.error("Submission error", response);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // New Email Confirmation handlers
  const handleEmailConfirmation = (code) => {
    console.log("Entered confirmation code:", code);
    // Once email is confirmed, you can trigger the final submission
    // Here, we assume the code is valid and proceed with the final API call.
    handleFinalSubmit();
  };

  const handleResendEmail = () => {
    console.log("Resending confirmation email...");
    // Implement your logic to re-send the confirmation code (e.g., call an API endpoint)
  };

  return (
    <div className="h-screen">
      {/* Header */}
      <div className="h-auto px-8 flex items-center bg-cnsc-primary-color">
        <img src="/general/cnsc_codex_ver_2.png" className="h-16" alt="logo" />
        <p className="text-white text-xl ml-4">Register Organization</p>
      </div>

      {/* Steps Indicator */}
      <div className="container mx-auto flex flex-col">
        <div className="flex h-auto p-4 justify-around items-center gap-4 mb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`h-24 w-24 rounded-full transition-all duration-500 flex items-center justify-center text-center text-sm font-semibold ${
                registrationStep === index
                  ? "h-32 w-32 bg-cnsc-secondary-color text-white"
                  : "bg-gray-300 text-black"
              }`}
              title={step}
            >
              {step}
            </div>
          ))}
        </div>

        {/* Step Components */}
        {registrationStep === 0 && (
          <OrganizationComponent
            formData={orgFormData}
            onChange={setOrgFormData}
            handleSubmit={handleOrgInfoSubmit}
          />
        )}

        {registrationStep === 1 && (
          <FileUploadComponent
            fields={fileFields}
            initialFiles={documentFormData}
            handleSubmit={handleFileUploadSubmit}
            onReturn={() => setRegistrationStep(0)}
          />
        )}

        {registrationStep === 2 && (
          <ReviewComponent
            formData={orgFormData}
            uploadedFiles={documentFormData}
            onEdit={handleEdit}
            onFileNameUpdate={handleFileNameUpdate}
            // Instead of directly calling final submission here, move to email confirmation step.
            onFinalSubmit={() => setRegistrationStep(3)}
          />
        )}

        {registrationStep === 3 && (
          <EmailConfirmationComponent
            email={orgFormData.organizationEmail}
            onConfirm={handleEmailConfirmation}
            onResend={handleResendEmail}
          />
        )}
      </div>
    </div>
  );
}
