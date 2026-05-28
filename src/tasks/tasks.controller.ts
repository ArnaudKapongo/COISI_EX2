import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer une nouvelle tâche',
    description:
      'Crée une tâche avec un titre, une description optionnelle et une priorité.',
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiCreatedResponse({
    description: 'Tâche créée avec succès',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Payload invalide' })
  createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les tâches en cours',
    description:
      'Retourne les tâches ayant le statut ACTIVE pour une équipe donnée.',
  })
  @ApiQuery({
    name: 'teamId',
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Identifiant de l’équipe',
  })
  @ApiOkResponse({
    description: 'Liste des tâches en cours',
    type: TaskResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'teamId invalide' })
  listActiveTasks(@Query() query: ListTasksQueryDto) {
    return this.tasksService.listActiveTasks(query.teamId);
  }

  @Patch(':id/complete')
  @ApiOperation({
    summary: 'Marquer une tâche comme terminée',
    description:
      'Passe une tâche au statut COMPLETED et renseigne la date de complétion.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '090fc6c4-0e2d-4885-86d8-ec478aa32d2e',
    description: 'Identifiant de la tâche',
  })
  @ApiOkResponse({
    description: 'Tâche marquée comme terminée',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Paramètre invalide' })
  @ApiNotFoundResponse({ description: 'Tâche inexistante' })
  @ApiConflictResponse({ description: 'Tâche déjà terminée' })
  completeTask(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tasksService.completeTask(id);
  }

  @Get('completed')
  @ApiOperation({
    summary: 'Lister l’historique des tâches terminées',
    description:
      'Retourne les tâches ayant le statut COMPLETED pour une équipe donnée.',
  })
  @ApiQuery({
    name: 'teamId',
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Identifiant de l’équipe',
  })
  @ApiOkResponse({
    description: 'Liste des tâches terminées',
    type: TaskResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'teamId invalide' })
  listCompletedTasks(@Query() query: ListTasksQueryDto) {
    return this.tasksService.listCompletedTasks(query.teamId);
  }
}
