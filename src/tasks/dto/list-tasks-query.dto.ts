import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ListTasksQueryDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Identifiant de l’équipe',
    })
    @IsUUID()
    teamId: string;
}