import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from '../services/auth.guard.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [AuthGuard],
    exports: [AuthGuard],
})
export class AuthModule { }
