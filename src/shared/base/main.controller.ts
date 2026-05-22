import { MainService } from './main.service.js';
import { PaginatedResponseDto, PaginationQueryDto } from '../dto/pagination.dto.js';

export abstract class MainController {
  constructor(protected readonly Service: MainService) { }

  abstract index<T, Q extends PaginationQueryDto = PaginationQueryDto>(query: Q): Promise<PaginatedResponseDto<T>>;
}
