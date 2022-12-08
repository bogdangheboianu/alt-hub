import { roFormatDate } from '@shared/functions/ro-format-date.function';
import { User } from '@users/models/user';
import { Vacation } from '@vacations/models/vacation';
import dayjs from 'dayjs';
import { AlignmentType, Document, HeadingLevel, IStylesOptions, Paragraph, TextRun } from 'docx';

export const vacationRequestDocumentBuilder = (vacation: Vacation, user: User): Document => {
    return new Document( {
                             styles,
                             sections: [
                                 {
                                     children: [
                                         title(),
                                         body( vacation, user ),
                                         signatureAndDate( user )
                                     ]
                                 }
                             ]
                         } );
};
const title = (): Paragraph => {
    return new Paragraph( {
                              heading  : HeadingLevel.HEADING_1,
                              alignment: AlignmentType.CENTER,
                              children : [
                                  new TextRun( { text: 'Domnule Director,' } ),
                                  new TextRun( { text: '', break: 3 } )
                              ]
                          } );
};

const body = (vacation: Vacation, user: User): Paragraph => {
    const fullName = user.personalInfo.fullName.joined;
    const workingDays = vacation.workingDays.getValue();
    const fromDate = roFormatDate( vacation.dateInterval.from.getValue() );
    const toDate = roFormatDate( vacation.dateInterval.to.getValue() );
    const dates = workingDays > 1
                  ? `${ workingDays } zile lucratoare in perioada ${ fromDate } - ${ toDate }`
                  : `o zi lucratoare in data de ${ fromDate }`;

    return new Paragraph( {
                              alignment: AlignmentType.START,
                              style    : 'default',
                              children : [
                                  new TextRun( { text: `Subsemnatul ${ fullName } angajat al ALTAMIRA SOFTWARE SRL va rog prin prezenta sa binevoiti a-mi aproba ${ dates }.` } ),
                                  new TextRun( { text: '', break: 1 } ),
                                  new TextRun( { text: 'Sperand intr-un raspuns favorabil, va multumesc anticipat.' } ),
                                  new TextRun( { text: '', break: 2 } )
                              ]

                          } );
};

const signatureAndDate = (user: User): Paragraph => {
    return new Paragraph( {
                              style   : 'default',
                              children: [
                                  new TextRun( { text: `Cu respect, ${ user.personalInfo.fullName.joined.toUpperCase() }                                                                                          ` } ),
                                  new TextRun( {
                                                   text: `Data: ${ dayjs()
                                                       .format( 'DD.MM.YYYY' ) }`
                                               } )
                              ]
                          } );
};

const styles: IStylesOptions = {
    default        : {
        heading1: {
            run: {
                color: '#000000',
                size : 25,
                font : 'Arial'
            }
        }
    },
    paragraphStyles: [
        {
            id       : 'default',
            run      : {
                color: '#000000',
                size : 25,
                font : 'Arial'
            },
            paragraph: {
                spacing: {
                    line: 320
                }
            }
        }
    ]
};
