import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StatisticRequestDto {
    @ApiProperty({
        description: 'The short url path to get it statistic',
        example: 'short1',
        required: true,
    })
    @IsString()
    readonly path: string;
}
