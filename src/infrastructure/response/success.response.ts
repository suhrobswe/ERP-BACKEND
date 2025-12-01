import { ISuccess } from '../pagination/successResponse';

export const successRes = (data: any, statusCode: number = 200): ISuccess => {
  return {
    statusCode,
    message: {
      uz: 'Amaliyot muvaffaqiyatli bajarildi',
      en: 'Operation successfully completed',
      ru: 'Операция успешно выполнена',
    },
    data,
  };
};
