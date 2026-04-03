const { createClient } = require('@supabase/supabase-js');


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Không tìm thấy file tải lên" });
 
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}_${Math.round(Math.random() * 1E9)}.${fileExt}`;
 
    const { data, error } = await supabase.storage
      .from('finsavvy-images') 
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;
 
    const { data: publicUrlData } = supabase.storage
      .from('finsavvy-images')
      .getPublicUrl(fileName);

    res.json({ 
        success: true, 
        url: publicUrlData.publicUrl 
    });
    
  } catch (err) {
    console.error("Lỗi upload:", err);
    res.status(500).json({ error: err.message });
  }
};