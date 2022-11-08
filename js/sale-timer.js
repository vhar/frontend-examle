$(function() {
    /**
     * Устанавливаем дату окончания акции
     */
    /* const endtime = new Date(2022, 11, 28, 20, 34, 0); */

    let now = new Date();
    now.setSeconds(now.getSeconds() + 70);
    const endtime = new Date(now);

    /**
     * Если акция еще действует инициализируем таймер и показываем счетчик
     */
    if (endtime > new Date()) {
        initializeTimer(endtime)
        $('#sale').slideDown(500);
    }

    console.log('JQuery sale-timer is done!'); 
});

/**
 * Выставляем начаьные значения чисел и запускаем таймер
 * total - количество оставшихся до окончания акции секунд.
 * Если total меньше или равен нулю, акция окночена и счетчик скрывается
 */
function initializeTimer(endtime) {
    let now = getTimeRemaining(endtime);

    updateTimerPair(0, 1, now.days);
    updateTimerPair(2, 3, now.hours);
    updateTimerPair(4, 5, now.minutes);
    updateTimerPair(6, 7, now.seconds);

    const timeinterval = setInterval(function() {
      const t = getTimeRemaining(endtime);

      updateTimerPair(0, 1, t.days);
      updateTimerPair(2, 3, t.hours);
      updateTimerPair(4, 5, t.minutes);
      updateTimerPair(6, 7, t.seconds);

      if (t.total <= 0) {
        clearInterval(timeinterval);
        $('#sale').slideUp('slow');
      }
    },1000);
}
/**
 * Получаем пары чисел для отображения в счетчики и количество секунд до окочания акции
 */
function getTimeRemaining(endtime){
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor( (total/1000) % 60 );
    const minutes = Math.floor( (total/1000/60) % 60 );
    const hours = Math.floor( (total/(1000*60*60)) % 24 );
    const days = Math.floor( total/(1000*60*60*24) );

    return { 
        total,
        days,
        hours,
        minutes,
        seconds
    };
}

/**
 * Обновляем пару чисел на экране
 */
function updateTimerPair(minor,major,value){
    switchDigit($('.digit-wrapper').eq(minor),Math.floor(value/10)%10);
    switchDigit($('.digit-wrapper').eq(major),value%10);
}

/**
 * Анимация смены цифры
 */
function switchDigit(wrapper, number){
    var digit = wrapper.find('.digit')

    if (digit.is(':animated')) {
        return false;
    }

    if (wrapper.data('digit') == number) {
        return false;
    }

    wrapper.data('digit', number);

    var replacement = $('<div>', {
        'class':'digit',
        css: {
            top:'-2.1em',
            opacity:0
        },
        html:number
    });

    digit.before(replacement)
        .removeClass('static')
        .animate({top:'2.5em',opacity:0}, 'fast', function() {
            digit.remove();
        });

    replacement.delay(100)
        .animate({top:0,opacity:1},'fast',function(){
            replacement.addClass('static');
        });
}
