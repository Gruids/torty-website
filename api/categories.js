const supabaseUrl = "https://tdfiimnmvovxfbesgjij.supabase.co";
const supabaseKey = "sb_secret_mCyxME51X27VXHPUek16mA_d9_65c0M";

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
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
      if (!response.ok) return res.status(response.status).json({ error: responseText });
      const data = JSON.parse(responseText);
      return res.json(data[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
