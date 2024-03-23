import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class EncodeResponseDto {
    @ApiProperty({
        description: 'The encode short',
        example: 'https://short.est/short1',
    })
    @IsUrl()
    shortUrl: string;
}
