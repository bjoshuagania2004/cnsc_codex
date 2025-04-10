import mongoose from "mongoose";
import { stringify } from "uuid";

const { Schema } = mongoose;

// Narrative Report Schema (For general & CMO 63)
const narrativeReportSchema = new Schema({
  owner: { type: String, required: true },
  documents: [{ type: String }], // URLs or paths to documents
});

// Event Type Schema
const eventTypeSchema = new Schema({
  type: { type: String, required: true },
  participation: { type: String, required: true }, // e.g., Internal, External, Collab, Contest
});

// CMO 63 Schema (CHED Requirements)
const cmo63Schema = new Schema({
  owner: { type: String },
  endorsement_letter: { type: String }, // URL to CHED endorsement letter
  program_of_activities: { type: String }, // URL to the program of activities
  accomplishment_report: { type: String }, // URL to the accomplishment report
  attendance_sheet: { type: String }, // URL to attendance sheet
});

// Award Schema
const awardSchema = new Schema({
  title: { type: String },
  level: {
    type: String,
    enum: ["International", "National", "Regional", "District", "Local"],
  },
  awardees: [{ type: String }],
  certificate_documents: [{ type: String }], // URLs to certificates
  photo_documentation: [{ type: String }], // URLs to photos
  date_concluded: { type: Date },
});

// Participation Schema
const participationSchema = new Schema({
  attendance_sheet: { type: String }, // URL to attendance sheet
  narrative_reports: [narrativeReportSchema], // Narrative reports
  awards: [awardSchema], // Awards received
});

// Expense Schema
const expenseSchema = new Schema({
  receipt_document: { type: String }, // URL to receipt
  finance_type: { type: String, enum: ["Disbursement", "Reimbursement"] },
  date_occurred: { type: Date },
});

// Resolution Schema
const resolutionSchema = new Schema({
  title: { type: String },
  document_url: { type: String }, // URL to the resolution document
  approval_date: { type: Date },
});

// Meeting Schema
const meetingSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  }, // Reference Organization
  notice_document: { type: String }, // URL to notice of meeting
  minutes_document: { type: String }, // URL to meeting minutes
  photo_documentations: [{ type: String }], // URLs to photos
  date: { type: Date },
  resolutions: [resolutionSchema], // Resolutions passed
});

// Event Schema
const eventSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  }, // Reference Organization

  title: { type: String, required: true },
  description: { type: String },
  event_date: { type: Date, required: true },
  evaluation_score: { type: Number },

  event_type: [eventTypeSchema],
  narrative_reports: [narrativeReportSchema],
  participation: [participationSchema],

  CMO63_documents: [cmo63Schema],

  financial_report: {
    liquidation_document: { type: String }, // URL to liquidation report
    expenses: [expenseSchema],
  },

  evaluation_document: { type: String }, // URL to evaluation report
});

// Proposal Schema
const proposalSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  }, // Reference Organization
  title: { type: String, required: true },
  event_date: { type: Date, required: true },

  description: { type: String },
  approval_status: { type: String, enum: ["Pending", "Approved", "Rejected"] },
  updated_date: { type: Date, default: Date.now },

  meeting: {
    notice_document: { type: String }, // URL to notice of meeting
    minutes_document: { type: String }, // URL to meeting minutes
    photo_documentations: [{ type: String }], // URLs to photos
    resolution_document: [{ type: String }], // URL to the resolution document
  },
});

// Model Export
const Event = mongoose.model("Event", eventSchema);
const Meeting = mongoose.model("Meeting", meetingSchema);
const Proposal = mongoose.model("Proposal", proposalSchema);

export { Event, Meeting, Proposal };
