import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        const transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            Secure: true,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASSWORD')
            },
        });

        await transporter.verify();
        console.log('Server is ready to take mesages')

        try {
            const info = await transporter.sendMail({
                from: '"MoneyPal"" <no-reply@moneypal.com>',
                to,
                subject,
                html,
            });

            console.log('Message sent: %s', info.messageId);
            console.log("Preview URL: $s", nodemailer.getTestMessageUrl(info));
        } catch (err) {
            console.error("Error while sending email:", err)
        }
    }
}