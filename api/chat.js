const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://tdfiimnmvovxfbesgjij.supabase.co',
  'sb_secret_EEZ5HeRTbH0x0YQODJZBCA_AfvJ2s9B'
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ЧТЕНИЕ
  if (req.method === 'GET') {
    // Для админа: получить список всех пользователей
    if (req.query.users) {
      const { data, error } = await supabase.rpc('get_chat_users');
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data || []);
    }

    // Для админа: все сообщения (если не выбран юзер) или диалог с юзером
    if (req.query.all) {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data || []);
    }

    // Для конкретного пользователя (или админа, смотрящего диалог)
    if (req.query.user_id) {
      const userId = req.query.user_id;
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`user_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: true });
      
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data || []);
    }

    return res.json([]);
  }

  // ОТПРАВКА
  if (req.method === 'POST') {
    const { sender, message, is_admin, user_id, recipient_id } = req.body;
    if (!message) return res.status(400).json({ error: 'Пусто' });

    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{ sender, message, is_admin, user_id, recipient_id }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
