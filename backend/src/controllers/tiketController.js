import * as tiketModel from '../models/tiketModel.js';

export const index = async (req, res) => {
  try {
    const tiket = await tiketModel.getAllTiket();
    res.status(200).json({ status: true, data: tiket });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama_tiket } = req.body;
    const updatedTiket = await tiketModel.updateTiket(id, { nama_tiket });
    if (!updatedTiket)
      return res.status(404).json({ status: false, message: 'Not found' });
    res.json({ status: true, data: updatedTiket });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

export const destroy = async (req, res) => {
  try {
    const id_tiket = Number(req.params.id);
    const deleted = await tiketModel.hapusTiket(id_tiket);
    if (!deleted)
      return res.status(404).json({ status: false, message: 'Not found' });
    res.json({ status: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

export const store = async (req, res) => {
  try {
    const { no_tiket, nama_tiket } = req.body;
    const newTiket = await tiketModel.tambahTiket({ no_tiket, nama_tiket });
    res.status(201).json({ status: true, data: newTiket });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

export const show = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id)
      return res.status(400).json({ status: false, message: 'Invalid id' });

    const tiket = await tiketModel.getTiketById(id);
    if (!tiket)
      return res.status(404).json({ status: false, message: 'Not found' });

    res.json({ status: true, data: tiket });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
