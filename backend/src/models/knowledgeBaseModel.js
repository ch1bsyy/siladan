/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import supabase from "../../config/database.js";

export const getAllKb = async () => {
  // Ambil semua knowledge base
  const { data: kbData, error: kbError } = await supabase
    .from("o_knowledge_base")
    .select("*");

  if (kbError) throw kbError;

  // Ambil semua kategori
  const { data: kategoriData, error: kategoriError } = await supabase
    .from("m_kategori_kb")
    .select("id_kategori_kb, kategori_kb");

  if (kategoriError) throw kategoriError;

  // Manual join: gabungkan data
  const result = kbData.map(kb => {
    const kategori = kategoriData.find(k => k.id_kategori_kb === kb.id_kategori_kb);
    return {
      ...kb,
      kategori_kb: kategori?.kategori_kb || null
    };
  });

  return result;
};

export const getKbById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("o_knowledge_base")
      .select("*")
      .eq("id_kb", id)
      .single(); // pastikan hanya 1 row

    // Tangani jika row tidak ditemukan
    if (error) {
      if (error.code === "PGRST116") {
        // Supabase row not found
        return null; // bisa juga return { message: 'Data tidak ditemukan' }
      } else {
        throw error; // error lain dilempar
      }
    }

    return data; // data ditemukan
  } catch (err) {
    console.error("getKbById error:", err.message);
    throw err; // lempar error ke controller
  }
};

export const addNewKb = async (kb) => {
  const { data, error } = await supabase
    .from("o_knowledge_base")
    .insert([kb])
    .select();

  if (error) throw error;
  return data;
};

export const updateKb = async (id, payload) => {
  const { data: updatedData, error } = await supabase
    .from("o_knowledge_base")
    .update({
      judul_kb: payload.judul_kb,
    })
    .eq("id_kb", id)
    .select();

  if (error) throw error;
  return updatedData;
};

export const deleteKb = async (id_kb) => {
  const { data, error } = await supabase
    .from("o_knowledge_base")
    .delete()
    .eq("id_kb", id_kb)
    .select();

  if (error) throw error;
  return data;
};
