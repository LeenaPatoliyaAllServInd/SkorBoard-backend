import nodemailer from 'nodemailer';

export default class MailService {
    private static instance: MailService;
    private transporter: nodemailer.Transporter;

    private constructor() {}

    //INSTANCE CREATE FOR MAIL
    static getInstance() {
        if (!MailService.instance) {
            MailService.instance = new MailService();
        }
        return MailService.instance;
    }

    //CREATE A CONNECTION FOR LIVE
    static async createConnection() {
        const options: any = {
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        };
        const transporter = nodemailer.createTransport(options);
        return transporter;
    }

    //SEND MAIL
    static async sendMail(options: any) {
        const transporter = await this.createConnection();
        return await transporter.sendMail({
            from: process.env.SMTP_SENDER || options.from,
            to: options.to,
            cc: options.cc || '',
            bcc: options.bcc || '',
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
    }
}
