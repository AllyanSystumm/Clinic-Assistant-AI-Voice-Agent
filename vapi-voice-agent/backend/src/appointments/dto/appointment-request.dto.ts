
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleAppointmentDto {
    @ApiProperty()
    patient_name: string;

    @ApiProperty()
    reason: string;

    @ApiProperty()
    start_time: string;
}

export class CancelAppointmentDto {
    @ApiProperty()
    patient_name: string;

    @ApiProperty()
    date: string;
}

export class ListAppointmentsDto {
    @ApiProperty({ required: false })
    date?: string;
}
