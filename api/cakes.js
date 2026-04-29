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
      const response = await fetch(`${supabaseUrl}/rest/v1/cakes?select=*&order=created_at.desc`, { headers });
      const data = await response.json();
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    const { name, category, description, fill, price, similar_ids, image } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Name and price required' });
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/cakes`, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'return=representation' },
        body: JSON.stringify([{ name, category, description, fill, price, similar_ids: similar_ids || [], image: image || '' }])
      });
      const data = await response.json();
      return res.json(data[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
