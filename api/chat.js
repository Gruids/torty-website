const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://tdfiimnmvovxfbesgjij.supabase.co', 'sb_secret_EEZ5HeRTbH0x0YQODJZBCA_AfvJ2s9B');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    if (req.query.unread) {
      const { count } = await supabase.from('chat_messages').select('*', { count: 'exact', head: true }).eq('is_admin', false);
      return res.json({ count: count || 0 });
    }
    const { data, error } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true }).limit(100);
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  }

  if (req.method === 'POST') {
    const { sender, message, is_admin } = req.body;
    if (!message) return res.status(400).json({ error: 'Сообщение пустое' });
    const { data, error } = await supabase.from('chat_messages').insert([{ sender, message, is_admin }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
