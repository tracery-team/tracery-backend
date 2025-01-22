import {
  IsAlphanumeric,
  IsEmail,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator'

export class SignUpDto {
  @IsAlphanumeric()
  @Matches(/^[_a-zA-Z].*$/, {
    message: 'nickname must start with a letter or an underscore',
  })
  nickname: string

  @Length(2, 25)
  firstName: string

  @Length(2, 25)
  lastName: string

  @IsEmail()
  email: string

  @IsStrongPassword()
  password: string
}
