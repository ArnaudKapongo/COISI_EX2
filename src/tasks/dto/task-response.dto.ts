import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../../../generated/prisma/enums';

export class TaskResponseDto {
    @ApiProperty({
        example: '090fc6c4-0e2d-4885-86d8-ec478aa32d2e',
    })
    id: string;

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    teamId: string;

    @ApiProperty({
        example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    })
    createdById: string;

    @ApiPropertyOptional({
        example: null,
    })
    assignedToId?: string | null;

    @ApiProperty({
        example: 'Préparer la réunion',
    })
    title: string;

    @ApiPropertyOptional({
        example: 'Préparer les points à présenter',
    })
    description?: string | null;

    @ApiProperty({
        enum: TaskPriority,
        example: TaskPriority.HIGH,
    })
    priority: TaskPriority;

    @ApiProperty({
        enum: TaskStatus,
        example: TaskStatus.ACTIVE,
    })
    status: TaskStatus;

    @ApiPropertyOptional({
        example: null,
    })
    completedAt?: Date | null;

    @ApiProperty({
        example: '2026-05-27T22:32:43.308Z',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2026-05-27T22:32:43.308Z',
    })
    updatedAt: Date;
}