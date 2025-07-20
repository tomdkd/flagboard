import { IsOptional, IsString, Length, Matches } from "class-validator";

export default class UpdateTenantDTO {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    legal_name?: string;

    @IsOptional()
    @Length(14, 14)
    @Matches(/^\d+$/)
    siret?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    postal_code?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @Length(10)
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    website?: string;
}