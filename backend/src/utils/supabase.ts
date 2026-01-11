import { createClient } from '@supabase/supabase-js';

// .env에 있는 정보 가져오기 (없으면 에러)
const supabaseUrl = process.env.SUPABASE_URL || ''; 
const supabaseKey = process.env.SUPABASE_KEY || ''; 

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadImageToSupabase = async (file: Express.Multer.File) => {
  try {
    // 1. 파일명 중복 방지 (시간_원래이름)
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`; // products 폴더 안에 저장

    // 2. Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('shoping-images') // 👈 아까 만든 버킷 이름
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new Error(`이미지 업로드 실패: ${error.message}`);
    }

    // 3. 업로드된 이미지의 "공개 URL" 가져오기
    const { data: publicUrlData } = supabase.storage
      .from('shoping-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl; // ✅ "https://...supabase.co/..." 형태의 URL 반환

  } catch (error) {
    console.error(error);
    throw new Error('Supabase 업로드 중 에러 발생');
  }
};