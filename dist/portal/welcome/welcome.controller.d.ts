import { WelcomeService } from './welcome.service';
import { CreateWelcomeDto } from './dto/create-welcome.dto';
import { UpdateWelcomeDto } from './dto/update-welcome.dto';
export declare class WelcomeController {
    private readonly welcomeService;
    constructor(welcomeService: WelcomeService);
    create(createWelcomeDto: CreateWelcomeDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateWelcomeDto: UpdateWelcomeDto): string;
    remove(id: string): string;
}
