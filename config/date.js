import moment from "moment/moment";

export function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

/**
 * @param time with format 'HH:mm:ss' 
 * @returns string text with format hh:ss a
 */
export const formatDuration = (time) => {
    const [hours, minutes] = time.split(':');
    const formattedHours = (hours % 12) || 12;
    const period = hours < 12 ? 'AM' : 'PM';
    const formattedTime = `${formattedHours}:${minutes} ${period}`;
    return formattedTime;
};

/**
 * @param datetime
 * @returns string text text with format hh:mm
 */

export const formatDateTimetoTime = (dateTime) => {
    const parsedDateTime = moment(dateTime);
    const formattedTime = parsedDateTime.format("hh:mm");
    return formattedTime;
};





/**
 * Return the format yyyy-mm-dd text when passing moment
 * @param {*} moment a moment instance from moment.js
 * @returns string text with format yyyy-mm-dd
 */
export const formatDateMoment = (moment) => {
    console.log(moment)
    return moment.format('YYYY-MM-DD')
}


