import React, { useState, useRef, useEffect } from "react";
import { ReturnButton, Submitbutton } from "../../../components/buttons";
import { ReusableFileUpload } from "../../../components/reusable_file_upload";
import SearchableDropdown from "../../../components/searchable_drop_down";

// Organization Component with Show/Hide Password indicator
export const OrganizationComponent = ({ formData, onChange, handleSubmit }) => {
  const [showOrgPassword, setShowOrgPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value,
    });
  };

  const toggleOrgPassword = () => setShowOrgPassword((prev) => !prev);

  const classification = formData.classification;
  const departments = ["Department A", "Department B", "Department C"];
  const courses = ["Course X", "Course Y", "Course Z"];

  const handleDepartmentChange = (selected) => {
    onChange({
      ...formData,
      department: selected,
    });
  };

  const handleCourseChange = (selected) => {
    onChange({
      ...formData,
      course: selected,
    });
  };

  return (
    <section className="mt-4">
      <form
        className="flex justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="w-[90%]">
          <div className="pt-10 pl-10 pr-10 bg-white mt-4">
            <section>
              <div className="mb-4 font-semibold text-lg flex items-center">
                <h1 className="w-2/5 max-w-fit mr-3">
                  Organization Information
                </h1>
              </div>
              <div className="grid grid-cols-6 gap-x-2 gap-y-1">
                {[
                  {
                    label: "Organization UserName",
                    id: "organizationUsername",
                  },
                  {
                    label: "Organization Password",
                    id: "organizationPassword",
                    type: showOrgPassword ? "text" : "password",
                  },
                  {
                    label: "Organization Name",
                    id: "organizationName",
                    colSpan: 4,
                  },
                  {
                    label: "Organization Acronym",
                    id: "organizationAcronym",
                    colSpan: 2,
                  },
                  {
                    label: "Organization President",
                    id: "organizationPresident",
                    colSpan: 3,
                  },
                  {
                    label: "Organization Email",
                    id: "organizationEmail",
                    colSpan: 3,
                  },
                ].map(({ label, id, colSpan = 3, type = "text" }) => (
                  <div
                    className={`flex flex-col gap-1 col-span-${colSpan}`}
                    key={id}
                  >
                    <label htmlFor={id}>
                      {label} <span className="text-red-500">*</span>
                    </label>
                    {id === "organizationPassword" ? (
                      <div className="relative">
                        <input
                          type={type}
                          id={id}
                          name={id}
                          autoComplete="new-password"
                          className="border py-2 px-4 rounded-2xl w-full"
                          value={formData[id] || ""}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={toggleOrgPassword}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                        >
                          {showOrgPassword ? (
                            <>
                              <i className="fa fa-eye"></i>
                              <span className="ml-1 text-sm">Hide</span>
                            </>
                          ) : (
                            <>
                              <i className="fa fa-eye-slash"></i>
                              <span className="ml-1 text-sm">Show</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <input
                        type={type}
                        id={id}
                        name={id}
                        className="border py-2 px-4 rounded-2xl"
                        value={formData[id] || ""}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </div>
                ))}

                <div className="col-span-6 flex">
                  <div className="flex flex-col w-2/5 gap-1">
                    <label>
                      Classification <span className="text-red-500">*</span>
                    </label>
                    <div className="flex h-full">
                      {["Local", "System-wide"].map((option) => (
                        <div
                          key={option}
                          className="flex items-center gap-2 flex-1"
                        >
                          <input
                            type="radio"
                            id={`classification${option}`}
                            name="classification"
                            value={option}
                            checked={classification === option}
                            onChange={handleChange}
                            className="h-6 w-6"
                            required
                          />
                          <label htmlFor={`classification${option}`}>
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {classification === "Local" && (
                    <div className="flex-1">
                      <div className="flex justify-between col-span-4 gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                          <label>
                            Department <span className="text-red-500">*</span>
                          </label>
                          <SearchableDropdown
                            label="Department"
                            options={departments}
                            value={formData.department}
                            onChange={handleDepartmentChange}
                            placeholder="Select Department"
                          />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <label>
                            Course <span className="text-red-500">*</span>
                          </label>
                          <SearchableDropdown
                            label="Course"
                            options={courses}
                            value={formData.course}
                            onChange={handleCourseChange}
                            placeholder="Select Course"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {classification === "System-wide" && (
                    <div className="flex-1">
                      <div className="flex flex-col gap-1 col-span-4">
                        <label htmlFor="specialization">
                          Specialization <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="specialization"
                          name="specialization"
                          className="border py-2 px-4 rounded-2xl"
                          value={formData.specialization || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="w-full mt-2 gap-4 flex justify-end pt-10 pb-5">
              <Submitbutton />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

// Adviser Component with Show/Hide Password indicator
export const AdviserComponent = ({
  formData,
  onChange,
  onReturn,
  handleSubmit,
}) => {
  const [showAdviserPassword, setShowAdviserPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value,
    });
  };

  const toggleAdviserPassword = () => setShowAdviserPassword((prev) => !prev);

  const classification = formData.classification;
  const departments = ["Department A", "Department B", "Department C"];
  const courses = ["Course X", "Course Y", "Course Z"];

  const handleDepartmentChange = (selected) => {
    onChange({
      ...formData,
      department: selected,
    });
  };

  const handleCourseChange = (selected) => {
    onChange({
      ...formData,
      course: selected,
    });
  };

  const handleAdviserDepartmentChange = (selected) => {
    onChange({
      ...formData,
      adviserDepartment: selected,
    });
  };

  return (
    <section className="mt-4">
      <form
        className="flex justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="w-[90%]">
          <div className="pt-10 pl-10 pr-10 bg-white shadow-2xl mt-4">
            {/* Adviser Section */}
            <section className="mt-4">
              <div className="mb-2 font-semibold text-lg flex items-center">
                <h1 className="w-2/5 max-w-fit mr-3">Adviser Information</h1>
              </div>
              <div className="grid grid-cols-6 gap-x-2 gap-y-1">
                <div className="flex flex-col gap-1 col-span-3">
                  <label htmlFor="adviserUsername">Adviser Username</label>
                  <input
                    type="text"
                    id="adviserUsername"
                    name="adviserUsername"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.adviserUsername || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-3">
                  <label htmlFor="adviserPassword">Adviser Password</label>
                  <div className="relative">
                    <input
                      type={showAdviserPassword ? "text" : "password"}
                      id="adviserPassword"
                      name="adviserPassword"
                      className="border py-2 px-4 rounded-2xl w-full"
                      value={formData.adviserPassword || ""}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={toggleAdviserPassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                    >
                      {showAdviserPassword ? (
                        <>
                          <i className="fa fa-eye"></i>
                          <span className="ml-1 text-sm">Hide</span>
                        </>
                      ) : (
                        <>
                          <i className="fa fa-eye-slash"></i>
                          <span className="ml-1 text-sm">Show</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1 col-span-3">
                  <label htmlFor="adviserName">Adviser Name</label>
                  <input
                    type="text"
                    id="adviserName"
                    name="adviserName"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.adviserName || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-3">
                  <label htmlFor="adviserEmail">Adviser Email</label>
                  <input
                    type="text"
                    id="adviserEmail"
                    name="adviserEmail"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.adviserEmail || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-between col-span-6 gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label htmlFor="adviserDepartment">Department</label>
                    <SearchableDropdown
                      label="Department"
                      options={departments}
                      value={formData.adviserDepartment}
                      onChange={handleAdviserDepartmentChange}
                      placeholder="Select Adviser Department"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="w-full mt-2 gap-4 flex justify-end pt-10 pb-5">
              <ReturnButton onClick={onReturn} text="Return" />
              <Submitbutton />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

// File Upload Component (unchanged)
export const FileUploadComponent = ({
  fields,
  handleSubmit,
  onReturn,
  initialFiles = {},
}) => {
  const [uploadedFiles, setUploadedFiles] = useState(initialFiles);

  useEffect(() => {
    setUploadedFiles(initialFiles);
  }, [initialFiles]);

  const handleFileChange = (fieldKey, files) => {
    if (!files || files.length === 0 || !files[0]) {
      setUploadedFiles((prev) => {
        const updated = { ...prev };
        delete updated[fieldKey];
        return updated;
      });
      return;
    }
    setUploadedFiles((prev) => ({ ...prev, [fieldKey]: files[0] }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(uploadedFiles);
  };

  return (
    <section>
      <form
        onSubmit={onSubmit}
        className="space-y-4 flex flex-col items-center my-5"
      >
        <div className="w-[90%]">
          <div className="p-4 bg-white shadow-2xl mt-3">
            <ReusableFileUpload
              fields={fields}
              onFileChange={handleFileChange}
            />
          </div>
          <div className="w-full gap-4 flex justify-end my-5">
            <ReturnButton onClick={onReturn} text="Return" />
            <Submitbutton />
          </div>
          <hr className="w-full" />
        </div>
      </form>
    </section>
  );
};

// Review Component with Student Password visible by default
export const ReviewComponent = ({
  formData,
  uploadedFiles,
  onEdit,
  onFinalSubmit,
}) => {
  // Adviser password remains hidden by default
  const [showAdviserPassword, setShowAdviserPassword] = useState(false);
  // Student password is visible by default for review purposes
  const [showStudentPassword, setShowStudentPassword] = useState(true);

  const toggleAdviserPassword = () => setShowAdviserPassword((prev) => !prev);
  const toggleStudentPassword = () => setShowStudentPassword((prev) => !prev);

  const isImage = (file) => file?.type?.startsWith("image/");
  const getPreviewUrl = (file) => (file ? URL.createObjectURL(file) : "");

  return (
    <div className="w-full min-h-full flex justify-center mt-5">
      <div className="w-[90%]">
        <div className="container mx-auto p-10 bg-white shadow-2xl mt-3">
          <section className="mt-4">
            <div className="mb-4 font-semibold text-lg flex items-center">
              <h1 className="w-2/5 max-w-fit mr-3">Review Information</h1>
            </div>
            {/* Organization Information */}
            <section className="mb-6">
              <h2 className="text-md font-semibold mb-2">
                Organization Information
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Name:</strong> {formData.organizationName}
                </p>
                <p>
                  <strong>Acronym:</strong> {formData.organizationAcronym}
                </p>
                <p>
                  <strong>President:</strong> {formData.organizationPresident}
                </p>
                <p>
                  <strong>Email:</strong> {formData.organizationEmail}
                </p>
                <p>
                  <strong>Classification:</strong> {formData.classification}
                </p>
                {formData.classification === "Local" && (
                  <>
                    <p>
                      <strong>Department:</strong> {formData.department}
                    </p>
                    <p>
                      <strong>Course:</strong> {formData.course}
                    </p>
                  </>
                )}
                {formData.classification === "System-wide" && (
                  <p>
                    <strong>Specialization:</strong> {formData.specialization}
                  </p>
                )}
              </div>
            </section>

            {/* Adviser Information */}
            <section className="mb-6">
              <h2 className="text-md font-semibold mb-2">
                Adviser Information
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Name:</strong> {formData.adviserName}
                </p>
                <p>
                  <strong>Email:</strong> {formData.adviserEmail}
                </p>
                <p>
                  <strong>Department:</strong> {formData.adviserDepartment}
                </p>
                <p>
                  <strong>Username:</strong> {formData.adviserUsername}
                </p>
                <p className="flex items-center gap-2">
                  <strong>Password:</strong>{" "}
                  {showAdviserPassword
                    ? formData.adviserPassword
                    : "•".repeat(formData.adviserPassword?.length || 8)}
                  <button
                    type="button"
                    onClick={toggleAdviserPassword}
                    className="text-blue-600 text-xs underline focus:outline-none"
                  >
                    {showAdviserPassword ? "Hide" : "Show"}
                  </button>
                </p>
              </div>
            </section>

            {/* Student Account */}
            <section className="mb-6">
              <h2 className="text-md font-semibold mb-2">Student Account</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Username:</strong> {formData.studentUsername}
                </p>
                <p className="flex items-center gap-2">
                  <strong>Password:</strong>{" "}
                  {showStudentPassword
                    ? formData.studentPassword
                    : "•".repeat(formData.studentPassword?.length || 8)}
                  <button
                    type="button"
                    onClick={toggleStudentPassword}
                    className="text-blue-600 text-xs underline focus:outline-none"
                  >
                    {showStudentPassword ? "Hide" : "Show"}
                  </button>
                </p>
              </div>
            </section>

            {/* Uploaded Files */}
            <section className="mb-6 flex flex-col items-center justify-center pt-10">
              <h2 className="text-md font-semibold mb-2">Uploaded Files</h2>
              <div className="flex flex-col gap-6 justify-center items-center">
                {uploadedFiles && Object.keys(uploadedFiles).length > 0 ? (
                  Object.entries(uploadedFiles).map(([key, file]) => (
                    <div
                      key={key}
                      className="flex flex-col items-center max-w-xs text-sm"
                    >
                      <strong className="mb-1">{key}:</strong>
                      {isImage(file) ? (
                        <img
                          src={getPreviewUrl(file)}
                          alt={file.name}
                          className="w-32 h-32 object-cover rounded shadow"
                        />
                      ) : (
                        <div className="text-gray-600 truncate text-center">
                          📄 {file.name}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div>No files uploaded</div>
                )}
              </div>
            </section>

            {/* Edit & Submit Buttons */}
            <div className="w-full flex justify-end gap-4">
              <button
                type="button"
                onClick={onEdit}
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-2xl"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onFinalSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl"
              >
                Submit Final
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Email Confirmation Component (unchanged)
export const EmailConfirmationComponent = ({ email, onConfirm, onResend }) => {
  const [code, setCode] = useState("");

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(code);
  };

  return (
    <div className="w-full min-h-full flex justify-center ">
      <div className="w-[90%] mt-4 ">
        <section className="mt-4 p-4 bg-white">
          <div className="font-semibold text-lg flex items-center mb-4">
            <h1 className="w-2/5 max-w-fit mr-3">Email Confirmation</h1>
          </div>
          <p className="text-sm mb-4">
            A confirmation code has been sent to <strong>{email}</strong>.
            Please enter the code below to verify your email address.
          </p>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="confirmationCode">Confirmation Code</label>
              <input
                type="text"
                id="confirmationCode"
                name="confirmationCode"
                className="border py-2 px-4 rounded-2xl"
                value={code}
                onChange={handleCodeChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onResend}
                className="text-blue-600 text-sm underline"
              >
                Resend Code
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl"
              >
                Confirm Email
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
