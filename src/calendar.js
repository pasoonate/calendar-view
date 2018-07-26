const CalendarView = (($) => {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    const NAME = 'calendarView'
    const VERSION = '1.0.0'
    const DATA_KEY = 'bs.calendar-view'
    const EVENT_KEY = `.${DATA_KEY}`
    const DATA_API_KEY = '.data-api'
    const JQUERY_NO_CONFLICT = $.fn[NAME]

    const Event = {
    }

    const ClassName = {
        WEEK_VIEW: 'calendar-week-view',
        DAY_VIEW: 'calendar-day-view',
        DAY_VIEW_TODAY: 'calendar-day-view-today',
        DAY_VIEW_INFOCUS: 'calendar-day-view-infocus',
        DAY_VIEW_OUTFOCUS: 'calendar-day-view-outfocus',
    }

    const Selector = {
        MONTH_VIEW: 'tbody.calendar-month-view'
    }

    /**
    * ------------------------------------------------------------------------
    * Class Definition
    * ------------------------------------------------------------------------
    */

    class CalendarView {
        constructor(element) {
            this.element = element;
            this.beforeRenderDayAction = (date) => { return date.getDate(); };
            
        }

        // Public

        render() {
            this._renderMonthView(new Date());
        }

        beforeRenderDay([action]) {
            if(typeof action === 'function') {
                this.beforeRenderDayAction = action;
            }
        }

        // Private

        _renderMonthView(today) {
            let $monthView = $(this.element).find(Selector.MONTH_VIEW);
            let firstOfWeek = new Date();
            let firstOfMonth = new Date(today);
            let firstOfWeekTime;
            let diffDaysToFirstWeek;

            firstOfMonth.setDate(1);
            diffDaysToFirstWeek = (firstOfMonth.getDay() + 1) % 7;
            firstOfWeekTime = firstOfMonth.getTime() - (diffDaysToFirstWeek * 24 * 60 * 60 * 1000);
            firstOfWeek.setTime(firstOfWeekTime);

            for(let i = 1; i <= 6; i++) {
                $monthView.append(this._renderWeekView(firstOfWeek, i, today));

                firstOfWeekTime += 7 * 24 * 60 * 60 * 1000;
                firstOfWeek.setTime(firstOfWeekTime);
            }
        }

        _renderWeekView(from, week, today) {
            let $week = $('<tr>');
            let dayStep = 24 * 60 * 60 * 1000;
            let day = new Date(from);
            
            $week.addClass(ClassName.WEEK_VIEW).addClass('week-' + week);

            for(let i = 0; i < 7; i++) {
                $week.append(this._renderDayView(day, today));
                day.setTime(day.getTime() + dayStep);
            }

            return $week;
        }

        _renderDayView(day, today) {
            let content = this.beforeRenderDayAction(day);
            let $day = $('<td role="presentation">');

            $day.addClass(ClassName.DAY_VIEW);
            $day.attr('data-pick', day.getTime());
            
            if(day.getMonth() === today.getMonth()) {
                $day.attr('data-day', day.getDate());
                $day.addClass(ClassName.DAY_VIEW_INFOCUS);
            }
            else {
                $day.addClass(ClassName.DAY_VIEW_OUTFOCUS);
            }

            if(day.toDateString() === today.toDateString()) {
                $day.addClass(ClassName.DAY_VIEW_TODAY);
            }

            $day.html(content);

            return $day;
        }

        // Static

        static _jQueryInterface(method, ...args) {
            return this.each(function () {
                const $this = $(this)
                let data = $this.data(DATA_KEY)

                if (!data) {
                    data = new CalendarView(this)
                    $this.data(DATA_KEY, data)
                }

                if (typeof method === 'string') {
                    if (typeof data[method] === 'undefined') {
                        throw new TypeError(`No method named "${method}"`)
                    }
                    data[method](args)
                }
            })
        }
    }

    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */

    // $(document)

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn[NAME] = CalendarView._jQueryInterface;
    $.fn[NAME].Constructor = CalendarView;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return CalendarView._jQueryInterface;
    }

    return CalendarView;
})($);