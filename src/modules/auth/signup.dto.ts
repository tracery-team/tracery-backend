import {
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator'

export class SignUpDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Matches(/^[_a-zA-Z].*$/, {
    message: 'nickname must start with a letter or an underscore',
  })
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
