import { IsNumber, IsString } from "class-validator";

export class LeadsFilterDto {
    @IsNumber()
    page?: number;

    @IsNumber()
    limit?: number;

    @IsString()
    sort?: string;

    @IsString()
    order?: string;

    @IsString()
    q?: string;
}