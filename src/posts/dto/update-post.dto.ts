import { IsString, Length } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @Length(0, 80)
  title: string;
  @IsString()
  @Length(0, 160)
  content: string;
}
