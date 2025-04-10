import { sendAccreditationMail } from "../middleware/emailer.js";
import { Accreditation } from "../models/users.js";
import { nanoid } from "nanoid";

export const createAccreditation = async (req, res) => {
  try {
    const {
      org_name,
      org_acronym,
      org_president,
      org_type,
      accreditation_type,
      org_email,
      adviser_email,
      status,
    } = req.body;


    // Check required fields
    if (
      !org_name ||
      !org_acronym ||
      !org_president ||
      !accreditation_type ||
      !org_email ||
      !adviser_email ||
      !status ||
      !org_type
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate org_type and sanitize it
    const { Classification, Departments, Fields } = org_type;

    if (!Classification || !["Local", "System-Wide"].includes(Classification)) {
      return res
        .status(400)
        .json({ message: "Invalid org_type.Classification." });
    }

    let sanitizedOrgType = { Classification };

    if (Classification === "Local") {
      if (!Array.isArray(Departments) || Departments.length === 0) {
        return res.status(400).json({
          message: "Departments are required for Local classification.",
        });
      }
      // Filter out departments where both Department and Course are empty, then map.
      sanitizedOrgType.Departments = Departments.filter(
        (dep) => dep.Department || dep.Course
      ).map((dep) => ({
        Department: dep.Department, // Only include if provided
        Course: dep.Course, // Only include if provided
      }));
    }

    // For "System-Wide" classification:
    if (Classification === "System-Wide") {
      if (!Array.isArray(Fields) || Fields.length === 0) {
        return res.status(400).json({
          message: "Fields are required for System-Wide classification.",
        });
      }
      // Map each field and filter out empty specializations.
      sanitizedOrgType.Fields = Fields.map((field) => ({
        fieldName: field.fieldName || "",
        specializations: Array.isArray(field.specializations)
          ? field.specializations.filter((spec) => spec) // Remove empty entries
          : [],
      }));
    }

    // Determine overall status
    const all_approved = Object.entries(status)
      .filter(([key]) => !key.toLowerCase().includes("notes"))
      .every(([_, val]) => val === "approved");

    const over_all_status = all_approved ? "accredited" : "pending";

    let org_accreditation_id, adviser_accreditation_id;
    if (over_all_status === "accredited") {
      org_accreditation_id = nanoid().replace(/[-_]/g, "").slice(0, 12);
      adviser_accreditation_id = nanoid().replace(/[-_]/g, "").slice(0, 12);
    }

    // Create and save accreditation record with sanitized org_type
    const accreditationData = {
      org_name,
      org_acronym,
      org_president,
      accreditation_type,
      org_type: sanitizedOrgType,
      org_email,
      adviser_email,
      over_all_status,
      status,
      ...(over_all_status === "accredited" && {
        org_accreditation_id,
        adviser_accreditation_id,
      }),
    };

    const newAccreditation = new Accreditation(accreditationData);
    await newAccreditation.save();

    // Prepare emails
    let org_email_subject, org_email_message;
    let adviser_email_subject, adviser_email_message;

    if (over_all_status === "accredited") {
      org_email_subject = "Accreditation Approved";
      org_email_message = `Congratulations! Your organization has been accredited.
Organization Accreditation ID: ${org_accreditation_id}
You may now use your accreditation ID for further actions.`;

      adviser_email_subject = "Accreditation Approved - Adviser Notification";
      adviser_email_message = `Dear Adviser,
Your organization ${org_name} has been accredited.
Adviser Accreditation ID: ${adviser_accreditation_id} (you can use this to set up your account)
Please advise the organization accordingly.`;
    } else {
      const revisions = Object.entries(status)
        .filter(([_, value]) => value.toLowerCase() === "revision")
        .map(([key]) => {
          const notesKey = `${key}_notes`;
          const altNotesKey = `${key} notes`;
          const notes =
            status[notesKey] || status[altNotesKey] || "No details provided";
          return `${key}: Revision required - ${notes}`;
        });

      org_email_subject = "Revisions Required";
      org_email_message = `Dear ${org_name},
The following revisions are required:

${revisions.join("\n")}

Please address these revisions at your earliest convenience.`;

      adviser_email_subject = "Revisions Required - Adviser Notification";
      adviser_email_message = `Dear Adviser,
The organization ${org_name} requires the following revisions:

${revisions.join("\n")}

Please communicate these revisions to the organization.`;
    }

    // Send emails
    await sendAccreditationMail(
      org_email,
      org_email_subject,
      org_email_message
    );
    await sendAccreditationMail(
      adviser_email,
      adviser_email_subject,
      adviser_email_message
    );

    // Respond to client
    res.status(201).json({
      message: "Accreditation submitted successfully!",
      org_accreditation_id,
      adviser_accreditation_id,
      over_all_status,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAccreditation = async (req, res) => {
  try {
    // Retrieve accreditationId from URL parameter or fallback to req.body._id
    const accreditationId = req.params.accreditationId || req.body._id;
    if (!accreditationId) {
      return res
        .status(400)
        .json({ message: "Missing accreditationId parameter." });
    }

    // Retrieve the existing accreditation record
    const accreditationRecord = await Accreditation.findById(accreditationId);
    if (!accreditationRecord) {
      return res
        .status(404)
        .json({ message: "Accreditation record not found." });
    }

    // Update fields if provided in the request body
    if (req.body.org_name) accreditationRecord.org_name = req.body.org_name;
    if (req.body.org_acronym)
      accreditationRecord.org_acronym = req.body.org_acronym;
    if (req.body.org_president)
      accreditationRecord.org_president = req.body.org_president;
    if (req.body.accreditation_type)
      accreditationRecord.accreditation_type = req.body.accreditation_type;
    if (req.body.org_email) accreditationRecord.org_email = req.body.org_email;
    if (req.body.adviser_email)
      accreditationRecord.adviser_email = req.body.adviser_email;

    // Validate and sanitize org_type if provided
    if (req.body.org_type) {
      const { Classification, Departments, Fields } = req.body.org_type;
      if (
        !Classification ||
        !["Local", "System-Wide"].includes(Classification)
      ) {
        return res
          .status(400)
          .json({ message: "Invalid org_type.Classification." });
      }
      let sanitizedOrgType = { Classification };

      if (Classification === "Local") {
        if (!Array.isArray(Departments) || Departments.length === 0) {
          return res.status(400).json({
            message: "Departments are required for Local classification.",
          });
        }
        sanitizedOrgType.Departments = Departments.filter(
          (dep) => dep.Department || dep.Course
        ).map((dep) => ({
          Department: dep.Department,
          Course: dep.Course,
        }));
      }

      if (Classification === "System-Wide") {
        if (!Array.isArray(Fields) || Fields.length === 0) {
          return res.status(400).json({
            message: "Fields are required for System-Wide classification.",
          });
        }
        sanitizedOrgType.Fields = Fields.map((field) => ({
          fieldName: field.fieldName || "",
          specializations: Array.isArray(field.specializations)
            ? field.specializations.filter((spec) => spec)
            : [],
        }));
      }
      accreditationRecord.org_type = sanitizedOrgType;
    }

    // Update status if provided and recalc overall status
    if (req.body.status) {
      accreditationRecord.status = req.body.status;
      const status = req.body.status;
      const allApproved = Object.entries(status)
        .filter(([key]) => !key.toLowerCase().includes("notes"))
        .every(([_, val]) => val === "approved");
      const over_all_status = allApproved ? "accredited" : "pending";
      accreditationRecord.over_all_status = over_all_status;

      // Generate accreditation IDs if status is accredited and IDs don't exist yet
      if (
        over_all_status === "accredited" &&
        (!accreditationRecord.org_accreditation_id ||
          !accreditationRecord.adviser_accreditation_id)
      ) {
        accreditationRecord.org_accreditation_id = nanoid()
          .replace(/[-_]/g, "")
          .slice(0, 12);
        accreditationRecord.adviser_accreditation_id = nanoid()
          .replace(/[-_]/g, "")
          .slice(0, 12);
      } else if (over_all_status !== "accredited") {
        accreditationRecord.org_accreditation_id = undefined;
        accreditationRecord.adviser_accreditation_id = undefined;
      }
    }

    // Save the updated record
    await accreditationRecord.save();

    // If status was updated, send email notifications
    if (req.body.status) {
      let org_email_subject, org_email_message;
      let adviser_email_subject, adviser_email_message;
      const over_all_status = accreditationRecord.over_all_status;

      if (over_all_status === "accredited") {
        org_email_subject = "Accreditation Approved";
        org_email_message = `Congratulations! Your organization has been accredited.
Organization Accreditation ID: ${accreditationRecord.org_accreditation_id}
You may now use your accreditation ID for further actions.`;

        adviser_email_subject = "Accreditation Approved - Adviser Notification";
        adviser_email_message = `Dear Adviser,
Your organization ${accreditationRecord.org_name} has been accredited.
Adviser Accreditation ID: ${accreditationRecord.adviser_accreditation_id} (you can use this to set up your account)
Please advise the organization accordingly.`;
      } else {
        const revisions = Object.entries(req.body.status)
          .filter(([_, value]) => value.toLowerCase() === "revision")
          .map(([key]) => {
            const notesKey = `${key}_notes`;
            const altNotesKey = `${key} notes`;
            const notes =
              req.body.status[notesKey] ||
              req.body.status[altNotesKey] ||
              "No details provided";
            return `${key}: Revision required - ${notes}`;
          });

        org_email_subject = "Revisions Required";
        org_email_message = `Dear ${accreditationRecord.org_name},
The following revisions are required:

${revisions.join("\n")}

Please address these revisions at your earliest convenience.`;

        adviser_email_subject = "Revisions Required - Adviser Notification";
        adviser_email_message = `Dear Adviser,
The organization ${
          accreditationRecord.org_name
        } requires the following revisions:

${revisions.join("\n")}

Please communicate these revisions to the organization.`;
      }

      await sendAccreditationMail(
        accreditationRecord.org_email,
        org_email_subject,
        org_email_message
      );
      await sendAccreditationMail(
        accreditationRecord.adviser_email,
        adviser_email_subject,
        adviser_email_message
      );
    }

    // Respond with the updated accreditation information
    res.status(200).json({
      message: "Accreditation updated successfully!",
      org_accreditation_id: accreditationRecord.org_accreditation_id,
      adviser_accreditation_id: accreditationRecord.adviser_accreditation_id,
      over_all_status: accreditationRecord.over_all_status,
    });
  } catch (error) {
    console.error("Error updating accreditation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAccreditations = async (req, res) => {
  try {
    const accreditations = await Accreditation.find();
    res.status(200).json(accreditations);
  } catch (error) {
    console.error("Error fetching accreditations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAccreditationById = async (req, res) => {
  try {
    const { id } = req.params;
    const accreditation = await Accreditation.findById(id);

    if (!accreditation) {
      return res.status(404).json({ message: "Accreditation not found" });
    }

    res.status(200).json(accreditation);
  } catch (error) {
    console.error("Error fetching accreditation by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
