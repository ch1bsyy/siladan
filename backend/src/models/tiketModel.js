import supabase from '../../config/database.js';

export const getAllTiket = async () => {
  const { data, error } = await supabase
    .from('m_tiket')
    .select('*');

  if (error) throw error;
  return data;
};

export const getTiketById = async (id) => {
  const { data, error } = await supabase
    .from('m_tiket')
    .select('*')
    .eq('id_tiket', id)
    .single(); // ambil satu record

  if (error) throw error;
  return data;
};

export const tambahTiket = async (tiket) => {
  const { data, error } = await supabase
    .from('m_tiket')
    .insert([tiket])
    .select(); // ambil satu record yang baru ditambahkan

  if (error) throw error;
  return data;
};

export const updateTiket = async (id_tiket, nama_tiket) => {
  const { data, error } = await supabase
    .from('m_tiket')
    .update({ nama_tiket })
    .eq('id_tiket', id_tiket)
    .select(); // ambil satu record yang diupdate
    if (error) throw error;
  return data;
};

export const hapusTiket = async (id_tiket) => {
  const { data, error } = await supabase
    .from('m_tiket')
    .delete()
    .eq('id_tiket', id_tiket)
    .select(); // ambil satu record yang dihapus
    if (error) throw error;
  return data;
};