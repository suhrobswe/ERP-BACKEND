import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { Pager } from './Pager';
import {
  IFindOptions,
  IResponsePagination,
} from '../pagination/successResponse';

export class RepositoryPager {
  public static readonly DEFAULT_PAGE = 1;
  public static readonly DEFAULT_PAGE_SIZE = 10;

  public static async findAll<T extends ObjectLiteral>(
    repository: Repository<T>,
    options?: IFindOptions<T>,
  ): Promise<IResponsePagination> {
    const [data, count] = await repository.findAndCount(
      RepositoryPager.normalizePagination(options),
    );
    return Pager.of(
      200,
      {
        uz: 'Amaliyot muvaffaqiyatli bajarildi',
        en: 'Operation successfully completed',
        ru: 'Операция успешно выполнена',
      },
      data,
      count,
      options?.take ?? this.DEFAULT_PAGE_SIZE,
      options?.skip ?? this.DEFAULT_PAGE,
    );
  }

  private static normalizePagination<T>(
    options?: IFindOptions<T>,
  ): FindManyOptions<T> {
    let page = (options?.skip ?? RepositoryPager.DEFAULT_PAGE) - 1;
    return {
      ...options,
      take: options?.take,
      skip: page * (options?.take ?? RepositoryPager.DEFAULT_PAGE_SIZE),
    };
  }
}
