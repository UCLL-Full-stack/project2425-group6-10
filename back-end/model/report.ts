import { Report as ReportPrisma } from '@prisma/client';

export class Report {
    private id?: number;
    private description: string;
    private date: string;

    constructor(report: { id?: number; description: string; date?: string }) {
        this.validate(report);
        this.id = report.id;
        this.description = report.description;
        this.date = report.date ? report.date : this.formatDate(new Date());
    }

    getId(): number | undefined {
        return this.id;
    }

    getDescription(): string {
        return this.description;
    }

    getDate(): string {
        return this.date;
    }

    validate(report: { id?: number; description: string }) {
        if (!report.description?.trim()) {
            throw new Error('Description is required');
        }
    }

    private formatDate(date: Date): string {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    static from({ id, description, date }: ReportPrisma) {
        return new Report({
            id,
            description,
            date,
        });
    }
}
