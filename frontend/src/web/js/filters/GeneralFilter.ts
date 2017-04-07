/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module ILovePlatos {

    export function Excerpt() {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    }

    export function Reverse() {

        return function (items, reverse) {            
            if(items && reverse) {
                return items.slice().reverse();
            }            
            return items;
        };

    }

    export function Minusculas() {

        return function (item) {            
            if(item) {
                return item.toLowerCase();;
            }            
            return item;
        };

    }

    export function Clean() {

        return function (item,whitespace) {            
            if(item) {
                if(whitespace) {
                    item = item.replace(/[ ]/gi, '');
                }else {
                    item = item.replace(/[ ]/gi, '-');
                }
                item = item.replace(/[á]/gi, 'a');
                item = item.replace(/[é]/gi, 'e');
                item = item.replace(/[í]/gi, 'i');
                item = item.replace(/[ó]/gi, 'o');
                item = item.replace(/[ú]/gi, 'u');
                item = item.replace(/[ñ]/gi, 'n');
                //item = item.replace(/[^\w\s\-]/gi, '');
                return item;
            }            
            return item;
        };

    }

    export function Concatenar() {

        return function (item,glue) {            
            if(item && glue) {
                return item = item.replace(/ /gi, glue);
            }
            return item;
        };

    }

    export function HexToRgb() {

        return function (hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

    }

    export function StringDate($filter,DateService) {

        return function (value, wordwise, max, tail) {
            if (!value) return $filter('translate')('sinfecha');

            if(value > 9999999999) {
                value = value/1000;
            }

            var dateObject = DateService.getDateObjectFromFecha(value);

            var date = new Date(dateObject.year, dateObject.month, dateObject.day, dateObject.hour, dateObject.minutes, dateObject.seconds);
            var now = new Date();

            var weekday = new Array(7);
            weekday[0]=  "domingo";
            weekday[1] = "lunes";
            weekday[2] = "jueves";
            weekday[3] = "miercoles";
            weekday[4] = "jueves";
            weekday[5] = "viernes";
            weekday[6] = "sabado";

            var dayName = weekday[date.getDay()];
            var day = DateService.pad(date.getDate());

            var monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
              "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ];

            var monthName = $filter('translate')(monthNames[date.getMonth()]);

            var year = date.getFullYear();
            var hour = DateService.pad(date.getHours());
            var minutes = DateService.pad(date.getMinutes());

            var diffMinutes = (now.getTime() - date.getTime()) / 1000 / 60;
            var diffHours = (now.getTime() - date.getTime()) / 1000 / 60 / 60;
            var diffDays = (now.getTime() - date.getTime()) /  1000 / 60 / 60 / 24;
            var diffWeeks = (now.getTime() - date.getTime()) /  1000 / 60 / 60 / 24 / 7;
            var diffMonths = (now.getTime() - date.getTime()) /  1000 / 60 / 60 / 24 / 30;
            var diffYears = (now.getTime() - date.getTime()) /  1000 / 60 / 60 / 24 / 365;

            var message = '';
            if(diffHours < 1) {
                message = 'Ahora mismo'
            }
            else if( diffHours >= 1 && diffDays < 1) {
                if(diffHours >= 1 && diffHours < 2) {
                    message = 'Hace 1 hora';
                }else {
                    message = 'Hace '+Math.floor(diffHours)+' horas';
                }
            }
            else if(diffDays >= 1 && diffWeeks < 1) {
                if(diffDays>=1 && diffDays<2) {
                    message = 'Hace 1 día';
                }else {
                    message = 'Hace '+Math.floor(diffDays)+' días';
                }
            }else if(diffWeeks >= 1 && diffMonths < 1) {
                if(diffWeeks>=1 && diffWeeks<2) {
                    message = 'Hace 1 semana';
                }else {
                    message = 'Hace '+Math.floor(diffWeeks)+' semanas';
                }
            }else if(diffMonths >= 1 && diffYears < 1) {
                if(diffMonths>=1 && diffMonths<2) {
                    message = 'Hace 1 mes';
                }else {
                    message = 'Hace '+Math.floor(diffMonths)+' meses';
                }
            }else if(diffYears >= 1) {
                if(diffYears>=1 && diffYears<2) {
                    message = 'Hace 1 año';
                }else {
                    message = 'Hace '+Math.floor(diffYears)+' años';
                }
            }

            //return day + ' de ' + monthName + '  de ' + year + ' a las ' + hour + ':' + minutes;
            return message;

        };
    }

}