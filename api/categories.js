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
      if (Array.isArray(data)) {
        data.forEach(cat => { 
          if (cat.cat_key) result[cat.cat_key] = cat.name; 
        });
      }
      
      return res.json(result);
    } catch (error) {
      return res.json({});
    }
  }

  if (req.method === 'POST') {
    return res.status(200).json({ cat_key: req.body.cat_key, name: req.body.name });
  }

  return res.json({});
};
