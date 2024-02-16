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
 * @returns string text with format hh:mm a
 */
export const formatDuration = (time) => {
    const [hours, minutes] = time.split(':');
    const formattedHours = hours % 12 || 12;
    const period = hours < 12 ? 'AM' : 'PM';
    const formattedTime = `${formattedHours}:${minutes} ${period}`;
    return formattedTime;
};


/**
 * @param datetime
 * @returns string text text with format HH:mm
 */

export const formatDateTimetoTime = (dateTime) => {
    const parsedDateTime = moment(dateTime);
    const formattedTime = parsedDateTime.format("HH:mm:ss");
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

/**
 * Return the format yyyy-mm-dd, hh:mm A text when passing dateTime
 * @param {*} moment a moment instance from moment.js
 * @returns string text with format yyyy-mm-dd, hh:mm A
 */
export const formatDateTimeFromNow = (dateTime) => {
    return moment(dateTime).locale('en').calendar(null, {
        sameDay: '[Hôm nay], hh:mm A',
        nextDay: '[Ngày mai], hh:mm A',
        nextWeek: 'DD/MM/YYYY, hh:mm A',
    });
};

export const formatDateMilisecond = (milliseconds) => {
    const date = new Date(milliseconds);
    console.log(milliseconds);
    console.log(date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
};
