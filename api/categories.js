// api/categories.js
const supabase = require('./supabase-client');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const categories = {};
    (data || []).forEach(cat => {
      categories[cat.key] = cat.name;
    });

    return res.json(categories);
  }

  if (req.method === 'POST') {
    const { admin_pass, cat_key, name } = req.body;

    if (admin_pass !== '1698') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{ key: cat_key, name: name }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
