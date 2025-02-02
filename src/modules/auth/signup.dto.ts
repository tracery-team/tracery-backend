import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator'

/**
 * Data Transfer Object (DTO) for handling user registration (sign-up) requests.
 *
 * This class validates and transfers the necessary data for user sign-up. It ensures that the nickname,
 * first name, last name, email, and password meet specific validation rules for successful registration.
 */
export class SignUpDto {
  /**
   * The user's nickname. It must start with a letter or an underscore and
   * consist of alphanumeric characters.
   * It must be between 4 and 25 characters long.
   *
   * @example 'john_doe'
   */
  @IsNotEmpty()
  @Matches(/^[_a-zA-Z][_a-zA-Z0-9]*$/, {
    message: 'nickname must start with a letter or an underscore',
  })
  @Length(4, 25)
  nickname: string

  /**
   * The user's first name. It must consist only of alphabetic characters
   * and be between 2 and 25 characters long.
   *
   * @example 'John'
   */
  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 25)
  firstName: string

  /**
   * The user's last name. It must consist only of alphabetic characters
   * and be between 2 and 25 characters long.
   *
   * @example 'Doe'
   */
  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 25)
  lastName: string

  /**
   * The user's email address. It must be a valid email format.
   *
   * @example 'johndoe@example.com'
   */
  @IsNotEmpty()
  @IsEmail()
  email: string

  /**
   * The user's password. It must be a strong password according to the
   * strength criteria (e.g., containing numbers, letters, and special characters).
   *
   * @example 'Password123!'
   */
  @IsNotEmpty()
  @IsStrongPassword()
  password: string
}
