import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isDefined } from '@datorama/akita';
import * as dayjs from 'dayjs';

type DateType = 'startDate' | 'endDate' | 'deadline'

@Component( {
                selector   : 'app-project-timeline-date',
                templateUrl: './project-timeline-date.component.html',
                styleUrls  : [ './project-timeline-date.component.scss' ]
            } )
export class ProjectTimelineDateComponent implements OnInit {
    @Input() date!: Date | null;
    @Input() type!: DateType;

    day?: string;
    month?: string;
    year?: string;
    formattedType = '';
    noDateText = '';

    @Output() onClick = new EventEmitter();

    constructor() {
    }

    ngOnInit(): void {
        if( isDefined( this.date ) ) {
            this.day = this.getDay();
            this.month = this.getMonth();
            this.year = this.getYear();
        } else {
            this.noDateText = this.getNoDateText();
        }

        this.formattedType = this.getFormattedType();
    }

    handleClick(): void {
        this.onClick.emit();
    }

    private getDay(): string {
        return dayjs()
            .date( dayjs( this.date! )
                       .date() )
            .format( 'DD' );
    }

    private getMonth(): string {
        return dayjs()
            .month( dayjs( this.date! )
                        .month() )
            .format( 'MMM' );
    }

    private getYear(): string {
        return dayjs()
            .year( dayjs( this.date! )
                       .year() )
            .format( 'YYYY' );
    }

    private getFormattedType(): string {
        switch( this.type ) {
            case 'startDate':
                return 'Start date';
            case 'endDate':
                return 'End date';
            case 'deadline':
                return 'Deadline';
        }
    }

    private getNoDateText(): string {
        return `No ${ this.getFormattedType()
                          .toLowerCase() } set`;

    }
}
