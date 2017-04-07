/// <reference path="../../typings/angularjs/angular.d.ts" />

module ILovePlatos{

    export class DateService {
        static $inject = [
            "config",
            "$http",
            "$q",
            "$log"
        ];

        constructor(
            private $config: any,
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private $log: ng.ILogService){}
            
        getDateFromFecha(fecha:string):Date {
            var dateObject = this.getDateObjectFromFecha(fecha);

            var date = new Date(dateObject.year, dateObject.month, dateObject.day, dateObject.hour, dateObject.minutes, dateObject.seconds);
            return date;
        }

        getDateObjectFromFecha(fecha:string):any {
            var date;
            if(!fecha) {
                new Date();
            }
            date = new Date(Number(fecha)*1000);

            var day = this.pad(date.getDate());
            var month = this.pad(date.getMonth());
            var year = date.getFullYear();
            var hour = this.pad(date.getHours());
            var minutes = this.pad(date.getMinutes());
            var seconds = this.pad(date.getSeconds());

            return {
                year:year,
                month:month,
                day:day,
                hour:hour,
                minutes:minutes,
                seconds:seconds
            }
        }

        pad(s) { return (s < 10) ? '0' + s : s; }

        getCurrentDateInString() {
            var date = new Date();
            var day = this.pad(date.getDate());
            var month = this.pad(date.getMonth()+1);
            var year = date.getFullYear();
            var hour = this.pad(date.getHours());
            var minutes = this.pad(date.getMinutes());
            var seconds = this.pad(date.getSeconds());

            //"2015-09-15 09:16:22"
            return year+'-'+month+'-'+day+' '+hour+':'+minutes+':'+seconds;
        }

        getCurrentDateInUnix() {
            //Importantisimo, la fecha tiene que ser en segundos o no lo traga el cloud search.
            return Math.floor( new Date().getTime()/ 1000 );
        }

    }

}