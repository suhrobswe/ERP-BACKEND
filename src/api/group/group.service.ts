import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupEntity } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/infrastructure';
import { TeacherService } from '../teacher/teacher.service';
import { successRes } from 'src/infrastructure/response/success.response';
import { ISuccess } from 'src/infrastructure/pagination/successResponse';
import { StatusDto } from '../teacher/dto/status.dto';

@Injectable()
export class GroupService extends BaseService<
  CreateGroupDto,
  UpdateGroupDto,
  GroupEntity
> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepo: Repository<GroupEntity>,
    private readonly teacherService: TeacherService,
  ) {
    super(groupRepo);
  }

  async createGroup(createGroupDto: CreateGroupDto): Promise<ISuccess> {
    if (createGroupDto.teacherId) {
      const existsTeacher = await this.teacherService.findOneById(
        createGroupDto.teacherId,
      );
      const teacherEntity = (existsTeacher as any).data ?? existsTeacher;
      const createdGroup = this.groupRepo.create({
        ...createGroupDto,
        teacher: teacherEntity,
      });
      const saved = await this.groupRepo.save(createdGroup);
      return successRes(saved, 201);
    }
    return this.create(createGroupDto);
  }

  async findAllForTeacher(teacherId: string) {
    const groups = await this.groupRepo
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.students', 'student')
      .leftJoinAndSelect('g.teacher', 'teacher')
      .where('g.teacherId = :teacherId', { teacherId })
      .select([
        'g.id',
        'g.name',
        'g.startTime',
        'g.endTime',
        'g.durationInMonths',
        'teacher.id',
        'teacher.name',
        'student.id',
        'student.name',
      ])
      .getMany();

    return successRes(groups);
  }

  async findOneForTeacher(teacherId: string, groupId: string) {
    const group = await this.groupRepo
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.students', 'student')
      .leftJoinAndSelect('g.teacher', 'teacher')
      .where('g.id = :groupId', { groupId })
      .andWhere('g.teacherId = :teacherId', { teacherId })
      .select([
        'g.id',
        'g.name',
        'g.startTime',
        'g.endTime',
        'g.durationInMonths',
        'teacher.id',
        'teacher.name',
        'student.id',
        'student.name',
        'student.email',
        'student.isActive',
        'student.avatarUrl',
      ])
      .getOne();

    if (!group) {
      throw new ForbiddenException("You don't have access to this group");
    }

    return successRes(group);
  }

  async findForStudent(studentId: string, groupId: string) {
    const group = await this.groupRepo
      .createQueryBuilder('group')
      .leftJoin('group.students', 'student')
      .where('group.id = :groupId', { groupId })
      .andWhere('student.id = :studentId', { studentId: studentId })
      .select(['group.id', 'group.name', 'group.lessonTime', 'student.name'])
      .getOne();

    return successRes(group);
  }

  async updateGroup(id: string, dto: UpdateGroupDto) {
    const group = await this.groupRepo.findOne({
      where: { id },
    });
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    let teacherEntity = undefined;
    if (dto.teacherId) {
      const existsTeacher = await this.teacherService.findOneById(
        dto.teacherId,
      );
      teacherEntity = (existsTeacher as any).data ?? existsTeacher;
    }

    const updatedGroup = this.groupRepo.merge(group, {
      ...dto,
      teacher: teacherEntity,
    });

    const saved = await this.groupRepo.save(updatedGroup);

    return successRes(saved, 200);
  }

  async updateStatusIsActive(id: string, dto: StatusDto) {
    const group = await this.groupRepo.findOne({ where: { id } });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    group.isActive = dto.isActive;

    await this.groupRepo.save(group);

    return {
      message: `group status updated to ${dto.isActive ? 'Active' : 'Blocked'}`,
      group,
    };
  }
}
