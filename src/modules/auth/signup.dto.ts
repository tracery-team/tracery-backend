import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator'

export class SignUpDto {
  @IsNotEmpty()
  @Matches(/^[_a-zA-Z][_a-zA-Z0-9]*$/, {
    message: 'nickname must start with a letter or an underscore',
  })
  @Length(4, 25)
  nickname: string

  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 25)
  firstName: string

  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 25)
  lastName: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsStrongPassword()
  password: string
}
