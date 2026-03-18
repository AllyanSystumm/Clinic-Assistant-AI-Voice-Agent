import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    async scheduleAppointment(patient_name: string, reason: string, start_time: string) {
        const startTimeDate = new Date(start_time);

        // Time availability check (12:00 PM to 5:00 PM)
        const hour = startTimeDate.getHours();
        if (hour < 12 || hour >= 17) {
            throw new BadRequestException("The clinic is only available between 12:00 PM and 5:00 PM. Please choose a different slot.");
        }

        // Double-booking check
        const existing = await this.prisma.appointment.findFirst({
            where: {
                start_time: startTimeDate,
                canceled: false,
            }
        });

        if (existing) {
            throw new BadRequestException("This slot is unavailable because it is already booked. Please choose a different slot.");
        }

        const newAppointment = await this.prisma.appointment.create({
            data: {
                patient_name,
                reason,
                start_time: startTimeDate,
            }
        });

        return newAppointment;
    }

    async cancelAppointment(patient_name: string, date: string) {
        if (!patient_name || !date) {
            throw new BadRequestException("Patient name and date are required for cancellation.");
        }

        const targetDate = new Date(date);
        if (isNaN(targetDate.getTime())) {
            throw new BadRequestException(`Invalid date provided: ${date}`);
        }

        const startDt = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        const endDt = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1);

        const appointments = await this.prisma.appointment.findMany({
            where: {
                patient_name: patient_name,
                start_time: {
                    gte: startDt,
                    lt: endDt,
                },
                canceled: false
            }
        });

        if (appointments.length === 0) {
            throw new NotFoundException(`No matching appointment for ${patient_name} on ${date} found in our system`);
        }

        await this.prisma.appointment.updateMany({
            where: {
                id: {
                    in: appointments.map(a => a.id)
                }
            },
            data: {
                canceled: true
            }
        });

        return { canceled_count: appointments.length };
    }

    async listAppointments(date?: string) {
        let whereClause: any = {};

        // If a specific date is requested
        if (date) {
            const targetDate = new Date(date);
            const startDt = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
            const endDt = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1);

            whereClause.start_time = {
                gte: startDt,
                lt: endDt,
            };
        }

        const appointments = await this.prisma.appointment.findMany({
            where: whereClause,
            orderBy: {
                start_time: 'asc'
            }
        });

        return appointments;
    }
}
