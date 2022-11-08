$(function() {
    const cities = {
        "Москва": "Москва",
        "Магадан": "Магадан",
        "Самара": "Самара",
        "Саратов": "Сратов",
        "Владивосток": "Владивосток",
        "Владимир": "Владимир",
        "Петрозаводск": "Петрозаводск",
        "Первомайск": "Первомайск"
    }

    let header = $('header').offset();
    let ul;

    /**
     * получаем выбранный город
     */
    let userCity = localStorage.getItem('selectedCity');

    /**
     * получаем текущую корзину
     */
     let cart = JSON.parse(localStorage.getItem('cart'));

    /**
     * получаем имя текущей страницы и делаем активной ссылку в меню навигации
     */
    let path = window.location.pathname;
    let currentPage = path.split("/").pop();

    $("nav a[href='" + currentPage + "']").addClass('active-menu-item');

    $('.active-menu-item').click(function(){
        return false;
    });

    /**
     * Сообщение об использоании сайтом cookies
     */
    if(localStorage.getItem('cookiesAgreement')) {
        $('.cookies-message').hide();
    }
    $('.cookies-button').click(function() {
        localStorage.setItem('cookiesAgreement', true);
        $('.cookies-message').hide();
    });

    /** 
     * Выбираем город пользователя
     */
     if(!userCity || cities[userCity] === undefined) {
        localStorage.setItem('selectedCity', cities[Object.keys(cities)[0]]);
    }
    $('#location span').html(localStorage.getItem('selectedCity'));
    $('#location').click(function() {
        $('#popup-content').append('<h4>Укажите ваш город:</h4><input type="text" id="city-search" placeholder="Введите город..."><div class="popup-items"></div></div>');
        $('.popup-items').append(buildBlock(cities));
        $('#popup-wrapper').fadeIn(500);

        $('#city-search').on('input', function() {
            let q = $('#city-search').val().toLowerCase();
            $('.popup-items p').each(function() {
                if (q.length < 1) {
                    $(this).show();
                } else if ($(this).text().toLowerCase().indexOf(q) >= 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
    });

    /**
     * Добавление товара в корзину
     */
    $('.add-to-cart').click(function() {
        let product = {};
        let added   = false;
        let aim     = $(this).parents('.product-wrapper');

        product.id       = aim.data('product-id');
        product.sku      = aim.find('.product-sku').html();
        product.name     = aim.find('h1').html();
        product.quantity = 1;
        product.price    = aim.find('.price').data('price');
        product.link     = location.href;
        product.picture  = aim.find('.product-thumbnail:first-child img').attr('src');

        if (cart) {
            for(let item of cart) {
                if (item.id == product.id) {
                    item.quantity = +item.quantity + 1;
                    added = true;
                    break;
                }
            }

            if (added === false) {
                cart.push(product);
            }
        } else {
            cart = [product];
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        
        message = `<div class="info"><p>Товар ${product.name} добавлен в корзину.</p><button type="button" class="page-go modal info" data-link="../cart.html">Перейти в корзину</button><button class="page-go modal" data-link="../catalog.html">Вернуться в каталог</button></div>`;
        $('#popup-content').append(message);
        $('#popup-wrapper').fadeIn(500);
    });

    /** 
     * фиксация хедера после прокрутки сроки с городом 
     * от display sticky пришлось отказаться из-за невозможности разместить его выше контента
     */
    $(window).scroll(function() {
        if ($(window).scrollTop() > header.top) {
            $('header').addClass("sticky");
        } else {
            $('header').removeClass("sticky");
        }
    });

    /** 
     * отслеживаем изменение ширины экрана для переключения нихнего меню в аккордион
     */
    $(window).resize(function() {
        if ($('.footer').css('flex-direction') === 'row') {
            $('.footer-item ul').removeAttr('style');
            $('.footer-item h4').removeClass('border-bottom');
        }

        if ($('.hamburger').css('display') === 'block') {
            $('aside').hide();
        } else {
            $('aside').show();
        }
    });
 
    /**
     * Скрываем боковое меню на маленьких ширинах экрана и показываем гамбургер 
     */
    if ($('.hamburger').css('display') === 'block') {
        $('aside').hide();
    } else {
        $('aside').show();
    }
    $('.hamburger').click(function(){
        $(this).toggleClass('open');
        $('aside').slideToggle(500);
    });

    /**
     * Слайдер. Готовое решение.
     */
    if ($('.slider').length) {
        $('.slider').bxSlider({
            mode: 'fade',
            captions: true,
            randomStart: true,
            slideWidth: 1140,
            pause: 6000,
            auto: true
        });
    }

    /**
     * Аккордион для нижнего меню
     */
    $('h4.footer-menu').click(function() {
        ul = $(this).next();
        if (ul.css('display') === 'none') {
            $('.footer-item ul').slideUp(500);
            $('.footer-item h4').removeClass('border-bottom');
            $(this).not('.border-bottom').addClass('border-bottom');
        } else {
            $(this).removeClass('border-bottom');
        }
        ul.slideToggle(500);
    });

    /**
     * Всплывающее окно
     */
    $('#popup-wrapper').click(function(e) {
        if (!$(e.target).closest("#popup-content").length) {
            $('#popup-wrapper').fadeOut(500, function(){
                $('#popup-content :nth-child(n + 2)').remove();
            });
        }
    });
    $(document).on('click', '.popup-close', function() {
        $('#popup-wrapper').fadeOut(500, function(){
            $('#popup-content :nth-child(n + 2)').remove();
        });
    });
    $(document).on('click', '.popup-items p', function() {
        localStorage.setItem('selectedCity', $(this).data('key'));
        $('#location span').html(localStorage.getItem('selectedCity'));
        $('#popup-wrapper').fadeOut(500, function(){
            $('#popup-content :nth-child(n + 2)').remove();
        });
    });

    function buildBlock(items) {
        let content = '';
    
        $.each(items, function(key, item) {
            content += '<p data-key="' + key + '">' + item + '</p>';
        });
    
        return content;
    }
        
    $(document).on('focus', '.error', function() {
        $(this).removeClass('error');
    });
    
    $(document).on('focus', '.info', function() {
        $(this).removeClass('info');
    });
    
    $(document).on('click', '.page-go', function() {
        location.href = $(this).data('link');

        if ($(this).hasClass('modal')) {
            $('#popup-wrapper').fadeOut(500, function(){
                $('#popup-content :nth-child(n + 2)').remove();
            });
        }
    });

    console.log('JQuery scripts is done!'); 
});

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
