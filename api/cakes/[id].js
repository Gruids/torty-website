// api/cakes/[id].js
const supabase = require('../supabase-client');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'DELETE') {
    const id = req.query.id;
    const { admin_pass } = req.query;
    if (admin_pass !== '1698') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('cakes')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
