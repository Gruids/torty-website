const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://tdfiimnmvovxfbesgjij.supabase.co', 'sb_secret_EEZ5HeRTbH0x0YQODJZBCA_AfvJ2s9B');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('cakes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  }

  if (req.method === 'POST') {
    const { name, category, description, fill, price, similar_ids, image } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Название и цена обязательны' });
    }

    const { data, error } = await supabase
      .from('cakes')
      .insert([{ name, category, description, fill, price, similar_ids: similar_ids || [], image: image || '' }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
