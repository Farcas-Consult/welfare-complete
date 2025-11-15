import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from './entities/meeting.entity';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
  ) {}

  async create(createMeetingDto: any) {
    const meeting = this.meetingRepository.create(createMeetingDto);
    const savedMeeting = await this.meetingRepository.save(meeting);
    return {
      message: 'Meeting created successfully',
      data: savedMeeting,
    };
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.meetingRepository.createQueryBuilder('meeting');

    if (status) {
      queryBuilder.where('meeting.status = :status', { status });
    }

    const [meetings, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Meetings retrieved successfully',
      data: {
        meetings,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async findOne(id: string) {
    const meeting = await this.meetingRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return {
      message: 'Meeting retrieved successfully',
      data: meeting,
    };
  }

  async update(id: string, updateMeetingDto: any) {
    const meeting = await this.meetingRepository.findOne({ where: { id } });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    Object.assign(meeting, updateMeetingDto);
    const updatedMeeting = await this.meetingRepository.save(meeting);

    return {
      message: 'Meeting updated successfully',
      data: updatedMeeting,
    };
  }
}

