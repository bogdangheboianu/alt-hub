export function datesAreEqual(date1: Date, date2: Date): boolean {
    const sameYear = date1.getFullYear() === date2.getFullYear();
    const sameMonth = date1.getMonth() === date2.getMonth();
    const sameDay = date1.getDay() === date2.getDay();

    return sameYear && sameMonth && sameDay;
}
