import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';
import { TaskPriority } from '../../../generated/prisma/enums';

export class CreateTaskDto {
    @ApiProperty({
        example: 'Préparer la réunion',
        description: 'Titre de la tâche',
        maxLength: 150,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title: string;

    @ApiPropertyOptional({
        example: 'Préparer les points à présenter',
        description: 'Description de la tâche',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        enum: TaskPriority,
        example: TaskPriority.HIGH,
        description: 'Priorité de la tâche',
    })
    @IsEnum(TaskPriority)
    priority: TaskPriority;

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Identifiant de l’équipe',
    })
    @IsUUID()
    teamId: string;

    @ApiProperty({
        example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        description: 'Identifiant de l’utilisateur créateur',
    })
    @IsUUID()
    createdById: string;

    @ApiPropertyOptional({
        example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        description: 'Identifiant optionnel de l’utilisateur assigné',
    })
    @IsUUID()
    @IsOptional()
    assignedToId?: string;
}