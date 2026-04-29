const supabaseUrl = "https://tdfiimnmvovxfbesgjij.supabase.co";
const supabaseKey = "sb_secret_mCyxME51X27VXHPUek16mA_d9_65c0M";

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/categories?select=*`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      });
      const data = await response.json();
      
      // Исправляем: поле называется "key", а не "cat_key"
      const result = {};
      data.forEach(cat => {
        if (cat.key && cat.name) {
          result[cat.key] = cat.name;
        }
      });
      
      console.log('Categories sent to frontend:', result);
      return res.json(result);
    } catch (error) {
      return res.json({});
    }
  }

  return res.json({});
};
