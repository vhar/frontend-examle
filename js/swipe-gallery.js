$(function() {
    /**
     * Собираем превью на странице и формируем из них гелерею для SwipeBox
     */
    if ($('.product-thumbnails a').length) {
        let gallery = [];
        $('.product-thumbnails a').each(function() {
            gallery.push({ href: $(this).attr('href'), title: $(this).attr('title') });
        });

        /**
         * Swipe Box инициализируем на основном изображении
         */
        if (gallery.length) {
            $('#product-image').click(function(e) {
                e.preventDefault();
                $.swipebox(
                    gallery,
                    {
                        useSVG: false,
                        hideBarsDelay: false
                    }
                );
            });
        }
    }

    /**
     * Обрабатываем клик по превью и меняем картинку в главном окне.
     * Swipe Box при этом не запускаем
     */
    $('.product-thumbnail').click(function(e) {
        e.preventDefault();

        $('.product-thumbnail').removeClass('selected');
        $(this).not('.selected').addClass('selected');
        $('.product-image img').attr('src', $(this).attr('href'));
    });

    console.log('JQuery swipe gallery is done!'); 
});