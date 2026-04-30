const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://tdfiimnmvovxfbesgjij.supabase.co', 'sb_secret_EEZ5HeRTbH0x0YQODJZBCA_AfvJ2s9B');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) return res.status(500).json({ error: error.message });

    const categories = {};
    (data || []).forEach(cat => {
      categories[cat.key] = cat.name;
    });
    return res.json(categories);
  }

  if (req.method === 'POST') {
    const { admin_pass, cat_key, name } = req.body;
    if (admin_pass !== '1698') return res.status(401).json({ error: 'Unauthorized' });
    if (!cat_key || !name) return res.status(400).json({ error: 'Заполни оба поля' });

    const { data, error } = await supabase
      .from('categories')
      .insert([{ key: cat_key, name: name }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Такой ключ уже существует' });
      }
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
