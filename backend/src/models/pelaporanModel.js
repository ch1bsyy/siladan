import supabase from "../../config/database";

export const getAllPelaporan = async () => {
  const { data, error } = await supabase
    .from("pelaporan")
    .select("*");

  if (error) throw error;
  return data;
};

// store Pelaporan 
export const tambahPelaporan = async (pelaporan) => {
  const { data, error } = await supabase
  .from('o_pelaporan')
  .insert([
    judul_pelaporan,
    desk_pelaporan,
    id_kategori_pelaporan,
    id_opd,
    foto_pelaporan,
    lokasi_kejadian,
    tanggal_kejadian
  ])
  .select();

  if (error) throw error;
  return data;
};