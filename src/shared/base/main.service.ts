import { PaginatedResponseDto, PaginationQueryDto } from "../dto/pagination.dto";

export abstract class MainService {
    
    constructor() {}

    abstract findAll<T, Q extends PaginationQueryDto = PaginationQueryDto>(query: Q): Promise<PaginatedResponseDto<T>>;
}