import { CreateWelcomeDto } from './dto/create-welcome.dto';
import { UpdateWelcomeDto } from './dto/update-welcome.dto';
export declare class WelcomeService {
    create(createWelcomeDto: CreateWelcomeDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateWelcomeDto: UpdateWelcomeDto): string;
    remove(id: number): string;
}
