// В GET запросе:
if (req.method === 'GET') {
    let query = supabase.from('chat_messages').select('*').order('created_at', { ascending: true }).limit(100);

    if (req.query.user_id) {
        // Если передан user_id — фильтруем
        query = query.eq('user_id', req.query.user_id);
    } 
    // Если ?all=1 — возвращаем все (для админа, лучше добавить проверку пароля, но пока так)
    else if (!req.query.unread) {
        // Обычный запрос без ID — возвращаем пустой массив, чтобы не видели чужое
        return res.json([]); 
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
}

// В POST запросе:
if (req.method === 'POST') {
    const { sender, message, is_admin, user_id } = req.body;
    if (!message) return res.status(400).json({ error: 'Сообщение пустое' });
    
    const { data, error } = await supabase.from('chat_messages').insert([{ 
        sender, message, is_admin, user_id: user_id || null 
    }]).select().single();
    
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
}
