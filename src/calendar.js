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
        CHANGE: `change${EVENT_KEY}`,
    }

    const ClassName = {
        WEEK_VIEW: 'calendar-week-view',
        DAY_VIEW: 'calendar-day-view',
        DAY_VIEW_TODAY: 'calendar-day-view-today',
        DAY_VIEW_INFOCUS: 'calendar-day-view-infocus',
        DAY_VIEW_OUTFOCUS: 'calendar-day-view-outfocus',
        DAY_VIEW_SELECTED: 'calendar-day-view-selected',
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
            this.calendar = 'jalali';
            this.current = Pasoonate.make()[this.calendar]();
            this.beforeRenderDayAction = (date) => { return date.getDay(); };

            this.render();
        }
        
        // Public
        
        render() {
            this._goto();
            $(this.element).trigger($.Event(Event.CHANGE, {
                current: Pasoonate.make(this.current.getTimestamp())[this.calendar]()
            }));
        }

        beforeRenderDay([action]) {
            if(typeof action === 'function') {
                this.beforeRenderDayAction = action;
            }
        }

        goto([year, month, day]) {
            this._goto(year, month, day);
        }

        nextMonth() {
            let date = Pasoonate.make(this.current.getTimestamp())[this.calendar]();
            date.addMonth(1);

            this._goto(date.getYear(), date.getMonth());
        }

        prevMonth() {
            let date = Pasoonate.make(this.current.getTimestamp())[this.calendar]();
            date.subMonth(1);

            this._goto(date.getYear(), date.getMonth());
        }

        // Private

        _renderMonthView() {
            let $monthView = $(this.element).find(Selector.MONTH_VIEW);
            let firstOfMonth = Pasoonate.make()[this.calendar]();
            let firstOfWeek;

            $monthView.empty();

            firstOfMonth.setTimestamp(this.current.getTimestamp()).setDay(1);

            firstOfWeek = firstOfMonth.subDay(firstOfMonth.dayOfWeek());

            for(let i = 1; i <= 6; i++) {
                $monthView.append(this._renderWeekView(firstOfWeek, i));

                firstOfWeek.addDay(7);
            }
        }

        _renderWeekView(from, week) {
            let $week = $('<tr>');
            let day = Pasoonate.make(from.getTimestamp())[this.calendar]();
            
            $week.addClass(ClassName.WEEK_VIEW).addClass('week-' + week);

            for(let i = 0; i < 7; i++) {
                $week.append(this._renderDayView(day));
                day.addDay(1);
            }

            return $week;
        }

        _renderDayView(day) {
            let content = this.beforeRenderDayAction(day);
            let $day = $('<td role="presentation">');
            let today = Pasoonate.make()[this.calendar]();

            $day.addClass(ClassName.DAY_VIEW);
            $day.attr('data-pick', day.getTimestamp());
            
            if(day.getMonth() === this.current.getMonth()) {
                $day.attr('data-day', day.getDay());
                $day.addClass(ClassName.DAY_VIEW_INFOCUS);
            }
            else {
                $day.addClass(ClassName.DAY_VIEW_OUTFOCUS);
            }

            if(day.format('yyyy-mm-dd') === today.format('yyyy-mm-dd')) {
                $day.addClass(ClassName.DAY_VIEW_TODAY);
            }

            if(day.format('yyyy-mm-dd') === this.current.format('yyyy-mm-dd')) {
                $day.addClass(ClassName.DAY_VIEW_SELECTED);
            }

            $day.html(content);

            return $day;
        }

        _goto(year, month, day) {
            
            let old = Pasoonate.make(this.current.getTimestamp())[this.calendar]();
            let isChange = false;

            isChange = (year && year != this.current.getYear()) | (month && month != this.current.getMonth()) | (day && day != this.current.getDay());

            if(isChange) {
                this.current.setYear(parseInt(year) || this.current.getYear());
                this.current.setMonth(parseInt(month) || this.current.getMonth());
                this.current.setDay(parseInt(day) || this.current.getDay());

                const changeEvent = $.Event(Event.CHANGE, {
                    old: old,
                    current: Pasoonate.make(this.current.getTimestamp())[this.calendar]()
                })

                $(this.element).trigger(changeEvent);
                
                if (changeEvent.isDefaultPrevented()) {
                    this.current.setTimestamp(old.getTimestamp());
                    return;
                }
            } 

            this._renderMonthView();
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