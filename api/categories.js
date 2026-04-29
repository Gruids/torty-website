const supabaseUrl = "https://tdfiimnmvovxfbesgjij.supabase.co";
const supabaseKey = "sb_secret_mCyxME51X27VXHPUek16mA_d9_65c0M";

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  };

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/categories?select=*`, { headers });
      const data = await response.json();
      console.log('Supabase categories data:', data);
      
      const categories = {};
      if (Array.isArray(data)) {
        data.forEach(cat => {
          // Проверяем ВСЕ возможные варианты имен полей
          const key = cat.cat_key || cat.key || cat.catKey;
          const name = cat.name;
          if (key && name) {
            categories[key] = name;
          }
        });
      }
      
      console.log('Returning categories:', categories);
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    const { admin_pass, cat_key, name } = req.body;
    if (admin_pass !== '1698') return res.status(401).json({ error: 'Unauthorized' });
    if (!cat_key || !name) return res.status(400).json({ error: 'cat_key and name required' });

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/categories`, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'return=representation' },
        body: JSON.stringify([{ cat_key, name }])
      });
      
      const responseText = await response.text();
      console.log('Supabase POST response:', response.status, responseText);
      
      if (!response.ok) {
        return res.status(response.status).json({ error:
