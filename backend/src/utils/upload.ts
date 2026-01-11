import multer from 'multer';

// ✅ 디스크(내 컴퓨터)가 아니라 메모리(RAM)에 임시 저장
// (Supabase로 바로 쏘기 위함)
const storage = multer.memoryStorage();

// 파일 필터링 (이미지만 허용)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB 제한
});