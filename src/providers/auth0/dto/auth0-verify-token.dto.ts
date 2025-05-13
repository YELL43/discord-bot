import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CredentialsSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  picture: z.string().nonempty(),
  sub: z.string().nonempty(),
});

export class Auth0VerifyTokenDto extends createZodDto(CredentialsSchema) {}
