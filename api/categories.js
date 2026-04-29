const supabaseUrl = "https://tdfiimnmvovxfbesgjij.supabase.co";
const supabaseKey = "sb_secret_mCyxME51X27VXHPUek16mA_d9_65c0M";

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/categories?select=*`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      const data = await response.json();
      
      const result = {};
      data.forEach(cat => {
        result[cat.key] = cat.name;
      });
      
      return res.json(result);
    } catch (error) {
      return res.json({});
    }
  }

  if (req.method === 'POST') {
    try {
      const { cat_key, name } = req.body;
      
      const response = await fetch(`${supabaseUrl}/rest/v1/categories`, {
        method: 'POST',
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
        body: JSON.stringify([{ key: cat_key, name }])
      });
      
      const data = await response.json();
      return res.json(data[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.json({});
};
