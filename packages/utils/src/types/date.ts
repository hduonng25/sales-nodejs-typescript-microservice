declare global {
    interface Date {
        addDays: typeof addDayImpl;
        addMinutes: typeof addMinutesImpl;
        addSeconds: typeof addSecondsImpl;
        addMillisecond: typeof addMillisecondImpl;
    }
}

const addDayImpl = function (this: Date, days: number): void {
    this.setDate(this.getDate() + days);
};

const addMinutesImpl = function (this: Date, minutes: number): void {
    this.setMinutes(this.getMinutes() + minutes);
};

const addSecondsImpl = function (this: Date, seconds: number): void {
    this.setSeconds(this.getSeconds() + seconds);
};

const addMillisecondImpl = function (this: Date, milliseconds: number): void {
    this.setMilliseconds(this.getMilliseconds() + milliseconds);
};

Date.prototype.addDays = addDayImpl;
Date.prototype.addMinutes = addMinutesImpl;
Date.prototype.addSeconds = addSecondsImpl;
Date.prototype.addMillisecond = addMillisecondImpl;

export {};
