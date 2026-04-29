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
      
      const result = {};
      data.forEach(cat => { 
        if (cat.cat_key) result[cat.cat_key] = cat.name; 
      });
      
      return res.json(result);
    } catch (error) {
      return res.json({}); // Возвращаем пустой объект вместо ошибки
    }
  }

  if (req.method === 'POST') {
    return res.json({ error: 'disabled' }); // Отключаем пока
  }

  return res.json({});
};
