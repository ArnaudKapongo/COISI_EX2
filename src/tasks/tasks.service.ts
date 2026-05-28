import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService) { }

    async createTask(dto: CreateTaskDto) {
        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                priority: dto.priority,
                teamId: dto.teamId,
                createdById: dto.createdById,
                assignedToId: dto.assignedToId,
                status: TaskStatus.ACTIVE,
            },
        });
    }

    async listActiveTasks(teamId: string) {
        return this.prisma.task.findMany({
            where: {
                teamId,
                status: TaskStatus.ACTIVE,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async listCompletedTasks(teamId: string) {
        return this.prisma.task.findMany({
            where: {
                teamId,
                status: TaskStatus.COMPLETED,
            },
            orderBy: {
                completedAt: 'desc',
            },
        });
    }

    async completeTask(id: string) {
        const task = await this.prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        if (task.status === TaskStatus.COMPLETED) {
            throw new ConflictException('Task is already completed');
        }

        return this.prisma.task.update({
            where: { id },
            data: {
                status: TaskStatus.COMPLETED,
                completedAt: new Date(),
            },
        });
    }
} 