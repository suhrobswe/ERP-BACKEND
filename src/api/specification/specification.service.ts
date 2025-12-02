import { Injectable } from '@nestjs/common';
import { CreateSpecificationDto } from './dto/create-specification.dto';
import { UpdateSpecificationDto } from './dto/update-specification.dto';
import { BaseService } from 'src/infrastructure';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { successRes } from 'src/infrastructure/response/success.response';
import { SpecificationEntity } from 'src/core';

@Injectable()
export class SpecificationService extends BaseService<
  CreateSpecificationDto,
  UpdateSpecificationDto,
  SpecificationEntity
> {
  constructor(
    @InjectRepository(SpecificationEntity)
    private readonly specificationRepo: Repository<SpecificationEntity>,
  ) {
    super(specificationRepo);
  }

  async createBulk() {
    const specifications = [
      { name: 'React Native', category: 'Mobile' },
      { name: 'Flutter', category: 'Mobile' },
      { name: 'React', category: 'Frontend' },
      { name: 'Vue', category: 'Frontend' },
      { name: 'Angular', category: 'Frontend' },
      { name: 'Node.js', category: 'Backend' },
      { name: 'Java', category: 'Backend' },
      { name: 'Python', category: 'Backend' },
      { name: 'Go', category: 'Backend' },
      { name: 'C++', category: 'Backend' },
      { name: 'C#', category: 'Backend' },
      { name: 'PHP', category: 'Backend' },
      { name: 'Ruby', category: 'Backend' },
      { name: 'Swift', category: 'Mobile' },
      { name: 'Kotlin', category: 'Mobile' },
      { name: 'Objective-C', category: 'Mobile' },
      { name: 'TypeScript', category: 'Frontend' },
      { name: 'JavaScript', category: 'Frontend' },
      { name: 'HTML', category: 'Frontend' },
      { name: 'CSS', category: 'Frontend' },
      { name: 'SQL', category: 'Backend' },
    ];
    const result: SpecificationEntity[] = [];
    for (let i = 0; i < specifications.length; i++) {
      const data = await this.specificationRepo.save(
        this.specificationRepo.create(specifications[i]),
      );
      result.push(data);
    }

    return successRes(result);
  }
}
