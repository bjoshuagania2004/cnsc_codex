import { Event, Meeting, Proposal } from "../models/documents.js";

// Generic function to create a document
const createDocument = (Model) => async (req, res) => {
  try {
    const document = new Model(req.body);
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Generic function to get all documents
const getDocuments = (Model) => async (req, res) => {
  try {
    const documents = await Model.find();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generic function to get a single document by ID
const getDocumentById = (Model) => async (req, res) => {
  try {
    const document = await Model.findById(req.params.id);
    if (!document)
      return res.status(404).json({ message: `${Model.modelName} not found` });
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generic function to update a document
const updateDocument = (Model) => async (req, res) => {
  try {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document)
      return res.status(404).json({ message: `${Model.modelName} not found` });
    res.status(200).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Generic function to delete a document
const deleteDocument = (Model) => async (req, res) => {
  try {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document)
      return res.status(404).json({ message: `${Model.modelName} not found` });
    res
      .status(200)
      .json({ message: `${Model.modelName} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assigning the functions for each model
export const createEvent = createDocument(Event);
export const getEvents = getDocuments(Event);
export const getEventById = getDocumentById(Event);
export const updateEvent = updateDocument(Event);
export const deleteEvent = deleteDocument(Event);

export const createMeeting = createDocument(Meeting);
export const getMeetings = getDocuments(Meeting);
export const getMeetingById = getDocumentById(Meeting);
export const updateMeeting = updateDocument(Meeting);
export const deleteMeeting = deleteDocument(Meeting);

export const createProposal = createDocument(Proposal);
export const getProposals = getDocuments(Proposal);
export const getProposalById = getDocumentById(Proposal);
export const updateProposal = updateDocument(Proposal);
export const deleteProposal = deleteDocument(Proposal);
