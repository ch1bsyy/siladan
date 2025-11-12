import supabase from '../../config/database.js';

export const getAllKb = async () => {
    const { data, error } = await supabase
        .from('o_knowledge_base')
        .select('*');

    if (error) throw error;
    return data;
};

export const getKbById = async (id) => {
    const { data, error } = await supabase
        .from('o_knowledge_base')
        .select('*')
        .eq('id_kb', id)
        .single();

    if (error) throw error;
    return data;
};

export const addNewKb = async (kb) => {
    const { data, error } = await supabase
        .from('o_knowledge_base')
        .insert([kb])
        .select();
    
    if (error) throw error;
    return data;
};

export const updateKb = async (id, payload) => {
  const { data: updatedData, error } = await supabase
    .from('o_knowledge_base')
    .update({
      judul_kb: payload.judul_kb
    })
    .eq('id_kb', id)
    .select();

  if (error) throw error;
  return updatedData;
};


export const deleteKb = async (id_kb) => {
    const { data, error } = await supabase
        .from('o_knowledge_base')
        .delete()
        .eq('id_kb', id_kb)
        .select();

    if (error) throw error;
    return data;
};