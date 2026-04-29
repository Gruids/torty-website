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
      console.log('Supabase ответ:', data);

      // Превращаем массив в объект
      const result = {};
      data.forEach(cat => {
        result[cat.key] = cat.name; // Используем cat.key (как в базе)
      });

      console.log('Отправляем на сайт:', result);
      return res.json(result);
    } catch (error) {
      console.error('Ошибка:', error);
      return res.json({}); // Возвращаем пустой объект вместо ошибки
    }
  }

  // Временно отключаем POST, чтобы сайт работал
  if (req.method === 'POST') {
    return res.status(200).json({ key: req.body.cat_key, name: req.body.name });
  }

  return res.json({});
};
