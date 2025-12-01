import { HttpException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  IFindOptions,
  IResponsePagination,
  ISuccess,
} from '../pagination/successResponse';
import { RepositoryPager } from '../pagination/RepositoryPager';
import { successRes } from '../response/success.response';

export class BaseService<CreateDto, UpdateDto, Entity> {
  constructor(private readonly repository: Repository<any>) {}

  get getRepository() {
    return this.repository;
  }

  async create(dto: CreateDto): Promise<ISuccess> {
    let data = this.repository.create({
      ...dto,
    }) as any as Entity;
    data = await this.repository.save(data);
    return successRes(data, 201);
  }

  async findAll(options?: IFindOptions<Entity>): Promise<ISuccess> {
    const data = (await this.repository.find({
      ...options,
    })) as Entity[];
    return successRes(data);
  }

  async findAllWithPagination(
    options?: IFindOptions<Entity>,
  ): Promise<IResponsePagination> {
    return await RepositoryPager.findAll(this.getRepository, options);
  }

  async findOneBy(options: IFindOptions<Entity>): Promise<ISuccess> {
    const data = (await this.repository.findOne({
      select: options.select || {},
      relations: options.relations || [],
      where: options.where,
    })) as Entity;
    if (!data) {
      throw new NotFoundException();
    }
    return successRes(data);
  }

  async findOneById(
    id: string,
    options?: IFindOptions<Entity>,
  ): Promise<ISuccess> {
    const data = (await this.repository.findOne({
      select: options?.select || {},
      relations: options?.relations || [],
      where: { id, ...options?.where },
    })) as unknown as Entity;
    if (!data) {
      throw new NotFoundException();
    }
    return successRes(data);
  }

  async update(id: string, dto: UpdateDto): Promise<ISuccess> {
    await this.findOneById(id);
    await this.repository.update(id, dto as any);
    const data = await this.repository.findOne({ where: { id } });
    return successRes(data);
  }

  async delete(id: string): Promise<ISuccess> {
    await this.findOneById(id);
    (await this.repository.delete(id)) as unknown as Entity;
    return successRes({});
  }

  async softDelete(id: string): Promise<ISuccess> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    console.log('user', user);
    user.isDeleted = true;

    const data = await this.repository.save(user);
    return successRes({ isDelete: data?.isDeleted });
  }

  async updateStatus(id: string): Promise<ISuccess> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    user.isActive = !user.isActive;
    const data = await this.repository.save(user);
    return successRes({ isActive: data?.isActive });
  }
}
