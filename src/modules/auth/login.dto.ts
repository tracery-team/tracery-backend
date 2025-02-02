import { IsNotEmpty } from 'class-validator'

/**
 * Data Transfer Object (DTO) for handling login requests.
 *
 * This class is used to validate and transfer the data required for user login.
 * It ensures that both the login (email or nickname) and password are provided and not empty.
 */
export class LoginDto {
  @IsNotEmpty()
  login: string

  @IsNotEmpty()
  password: string
}
