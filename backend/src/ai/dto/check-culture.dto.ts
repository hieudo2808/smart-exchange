import { IsNotEmpty, IsString } from "class-validator";

export class CheckCultureDto {
    @IsString()
    @IsNotEmpty()
    text: string;
}
