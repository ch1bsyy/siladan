import * as knowledgeBaseModel from '../models/knowledgeBaseModel.js';

// Get ALL KB
export const index = async (req, res) => {
  try {
    const knowlegdeBase = await knowledgeBaseModel.getAllKb();
    res.status(200).json({ status: true, data: knowlegdeBase });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// Get KB by ID
export const show = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id)
      return res.status(400).json({ status: false, message: 'Invalid id' });

    const kb = await knowledgeBaseModel.getKbById(id);
    if (!kb)
      return res.status(404).json({ status: false, message: 'Not found' });

    res.status(201).json({ status: true, data: kb });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// Add New KB
export const store = async (req, res) => {
  try {
    let { judul_kb, id_kategori_kb, deskripsi_kb, artikel_kb, is_active } =
      req.body;

    is_active = is_active ?? 1;

    const newKb = await knowledgeBaseModel.addNewKb({
      judul_kb,
      id_kategori_kb,
      deskripsi_kb,
      artikel_kb,
      is_active,
    });

    res.status(201).json({ status: true, data: newKb });
  } catch (err) {
    res.status(500).json({ status: false, data: err.message });
  }
};

// Update KB by ID
export const update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { judul_kb } = req.body;
    const updatedKb = await knowledgeBaseModel.updateKb(id, { judul_kb });
    if (!updatedKb)
      return res.status(404).json({ status: false, message: 'Not found' });
    res.json({ status: true, data: updatedKb });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// Delete KB by ID
export const destroy = async (req, res) => {
  try {
    const id_kb = Number(req.params.id);
    const deleted = await knowledgeBaseModel.deleteKb(id_kb);
    if (!deleted)
      return res.status(404).json({ status: false, message: 'Not found' });
    res.json({ status: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
