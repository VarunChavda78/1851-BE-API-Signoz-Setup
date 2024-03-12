import { IsOptional } from "class-validator";

export interface PaginationDto {
    limit: number;
    page: number;
    order : string;
    sort : string;
}