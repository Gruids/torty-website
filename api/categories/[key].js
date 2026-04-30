const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://tdfiimnmvovxfbesgjij.supabase.co', 'sb_secret_EEZ5HeRTbH0x0YQODJZBCA_AfvJ2s9B');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { key } = req.query;

  if (req.method === 'DELETE') {
    const { admin_pass } = req.query;
    if (admin_pass !== '1698') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Пробуем обе колонки — key и cat_key
    const { data: existing } = await supabase
      .from('categories')
      .select('key, cat_key')
      .or(`key.eq.${key},cat_key.eq.${key}`)
      .limit(1);

    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    let error;
    if (existing[0].cat_key !== undefined) {
      ({ error } = await supabase.from('categories').delete().eq('cat_key', key));
    } else {
      ({ error } = await supabase.from('categories').delete().eq('key', key));
    }

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
