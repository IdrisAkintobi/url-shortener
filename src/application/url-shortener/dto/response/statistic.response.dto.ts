import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class StatisticResponseDto {
    @ApiProperty({
        description: 'The long url',
        example: 'https://example.com/this-is-a-very-long-url',
    })
    @IsUrl()
    longUrl: string;

    @ApiProperty({
        description: 'The short url',
        example: 'https://short.est/abc123',
    })
    @IsUrl()
    shortUrl: string;

    @ApiProperty({
        description: 'The date in ISO string that the short url was created',
        example: '2024-03-23T12:20:38.882Z',
    })
    @IsUrl()
    createdAt: string;

    @ApiProperty({
        description: 'The date in ISO string that the short url was accessed',
        example: '2024-03-23T12:20:38.882Z',
    })
    @IsUrl()
    lastAccessedAt: string;

    @ApiProperty({
        description: 'The number of times that the short url was accessed',
        example: '2024-03-23T12:20:38.882Z',
    })
    @IsUrl()
    accessCount: number;
}
