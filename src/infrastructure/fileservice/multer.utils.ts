import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { appConfig } from 'src/config';

// Fayl yuklanadigan asosiy papka
export const UPLOAD_DESTINATION = join(process.cwd(), appConfig.UPLOAD_FOLDER || 'uploads');
// Papka borligini tekshirish va yaratish
export const createDestination = () => {
  if (!existsSync(UPLOAD_DESTINATION)) {
    mkdirSync(UPLOAD_DESTINATION, { recursive: true });
  }
};

// Multer uchun umumiy nastroyka
export const multerOptions = {
  // Faylni qayerga va qanday nom bilan saqlash
  storage: diskStorage({
    destination: (req, file, cb) => {
      createDestination(); // Papka bo'lmasa yaratadi
      cb(null, UPLOAD_DESTINATION);
    },
    filename: (req, file, cb) => {
      // Fayl nomi: unique-id.jpg
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
  // Faqat rasm yuklashini tekshirish
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  // Hajmni cheklash (masalan 5MB)
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
};