import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { ScheduleAppointmentDto, CancelAppointmentDto, ListAppointmentsDto } from './dto/appointment-request.dto';

@Controller()
export class AppointmentsController {
    private readonly logger = new Logger(AppointmentsController.name);

    constructor(private readonly appointmentsService: AppointmentsService) { }

    private extractArguments(body: any): any {
        // Handle VAPI tool-call format if present
        if (body?.message?.toolCalls?.[0]?.function?.arguments) {
            const args = body.message.toolCalls[0].function.arguments;
            return typeof args === 'string' ? JSON.parse(args) : args;
        }
        return body;
    }

    @Post('schedule_appointment')
    async scheduleAppointment(@Body() body: any) {
        this.logger.log(`Received schedule request: ${JSON.stringify(body)}`);
        const args = this.extractArguments(body);
        return this.appointmentsService.scheduleAppointment(args.patient_name, args.reason, args.start_time);
    }

    @Post('cancel_appointment')
    async cancelAppointment(@Body() body: any) {
        this.logger.log(`Received cancel request: ${JSON.stringify(body)}`);
        const args = this.extractArguments(body) || {};
        return this.appointmentsService.cancelAppointment(args.patient_name, args.date);
    }

    @Post('list_appointments')
    async listAppointments(@Body() body: any) {
        this.logger.log(`Received list request: ${JSON.stringify(body)}`);
        const args = this.extractArguments(body) || {};
        return this.appointmentsService.listAppointments(args?.date);
    }
}
