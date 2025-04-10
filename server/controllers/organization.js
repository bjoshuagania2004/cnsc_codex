import { Organizations } from "../models/users.js";

// Create a new Organization
export const createOrganization = async (req, res) => {
  try {
    const newOrg = new Organizations(req.body);
    await newOrg.save();
    res.status(201).json(newOrg);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Organizations
export const getOrganizations = async (req, res) => {
  try {
    const allOrgs = await Organizations.find();
    res.status(200).json(allOrgs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Organization by ID
export const getOrganizationById = async (req, res) => {
  try {
    const org = await Organizations.findById(req.params.id);
    if (!org) return res.status(404).json({ error: "Organization not found" });
    res.status(200).json(org);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Organization
export const updateOrganization = async (req, res) => {
  try {
    const updatedOrg = await Organizations.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedOrg)
      return res.status(404).json({ error: "Organization not found" });
    res.status(200).json(updatedOrg);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an Organization
export const deleteOrganization = async (req, res) => {
  try {
    const deletedOrg = await Organizations.findByIdAndDelete(req.params.id);
    if (!deletedOrg)
      return res.status(404).json({ error: "Organization not found" });
    res.status(200).json({ message: "Organization deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
