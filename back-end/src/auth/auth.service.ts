import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwt: JwtService
	) {}

	async login(dto: AuthDto) {
		const exsistingUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});
		if (!exsistingUser) throw new NotFoundException('Dont have such user');

		const passwordIsValid = await verify(exsistingUser.password, dto.password);
		if (!passwordIsValid) throw new UnauthorizedException('Wrong password');

		const tokens = await this.createTokens(exsistingUser.id);
		const fields = this.returnUserFields(exsistingUser);

		return { fields, tokens };
	}

	async refresh(dto: RefreshTokenDto) {
		const result = await this.jwt.verifyAsync(dto.refreshToken);
		if (result) throw new UnauthorizedException('Invalid refresh token');

		const user = await this.prisma.user.findUnique({
			where: {
				id: result.id
			}
		});

		const tokens = await this.createTokens(user.id);
		const fields = this.returnUserFields(user);

		return { fields, tokens };
	}

	async register(dto: AuthDto) {
		const exsistingUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});
		if (exsistingUser) throw new ConflictException('User already exists');

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				name: faker.name.firstName(),
				avatarPath: faker.image.avatar(),
				phone: faker.phone.number(),
				password: await hash(dto.password)
			}
		});

		const tokens = await this.createTokens(user.id);
		const fields = this.returnUserFields(user);

		return { fields, tokens };
	}

	private async createTokens(userId: number) {
		const data = { id: userId };

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		});

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		});

		return { accessToken, refreshToken };
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email
		};
	}
}
