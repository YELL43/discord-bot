import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CredentialsSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

export class LoginTestDto extends createZodDto(CredentialsSchema) {}
