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

    // Нормализуем поля под фронтенд
    const normalized = (data || []).map(cake => ({
      ...cake,
      desc: cake.desc || cake.description || '',
      description: cake.desc || cake.description || '',
      similar: cake.similar || cake.similar_ids || [],
      similar_ids: cake.similar || cake.similar_ids || []
    }));
    
    return res.json(normalized);
  }

  if (req.method === 'POST') {
    const { name, category, description, fill, price, similar_ids, image } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Название и цена обязательны' });
    }

    // Пробуем вставить с обоими именами колонок
    const { data, error } = await supabase
      .from('cakes')
      .insert([{ name, category, description, desc: description, fill, price, similar_ids, similar: similar_ids || [], image: image || '' }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
