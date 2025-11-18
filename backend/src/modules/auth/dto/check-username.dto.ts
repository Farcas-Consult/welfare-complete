import { IsString, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CheckUsernameDto {
  @ApiProperty({
    description: "Username to check for availability",
    example: "johndoe",
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      "Username can only contain letters, numbers, and underscores. No spaces allowed.",
  })
  username: string;
}
