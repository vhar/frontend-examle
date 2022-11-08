$(function() {
    const urlParams = new URLSearchParams(window.location.search);

    let currentCategory = urlParams.get('category');

    if (currentCategory) {
        sessionStorage.setItem('category', currentCategory);
    } else if(sessionStorage.getItem('category')) {
        currentCategory = sessionStorage.getItem('category');
    }

    $('.collapsed').children('ul').css('display', 'none');

    if (currentCategory) {
        $('.menu-item').removeClass('menu-active');
        $('#menu-item-' + currentCategory).addClass('menu-active');
        $('#menu-item-' + currentCategory).parents('li').removeClass('collapsed');
        $('#menu-item-' + currentCategory).parents('li').addClass('expanded');
        $('.expanded').parents('ul').css('display','block');
        $('.expanded').children('ul').css('display', 'block');
    }

    $('.menu-item').click(function() {
        let url = $(this).children('a').attr('href');
        let opened;

        if ($(this).hasClass('expanded') && url === undefined) {
            $(this).removeClass('expanded');
            $(this).addClass('collapsed');
            $(this).children('ul').slideUp(500);
            return false;
        } else if ($(this).hasClass('collapsed')) {
            if ($(this).hasClass('menu-depth-2')) {
                $('.expanded.menu-depth-2 ul').slideUp(500);
                opened = $('.menu-depth-2.expanded');
                opened.addClass('collapsed');
                opened.removeClass('expanded');
            } else if ($(this).hasClass('menu-item-depth-1')) {
                $('.expanded.menu-depth-1 ul').slideUp(500);
                opened = $('.menu-depth-1.expanded');
                opened.addClass('collapsed');
                opened.removeClass('expanded');
            }
            $(this).removeClass('collapsed');
            $(this).addClass('expanded');
            $(this).children('ul').slideDown(500);
            if (url === undefined) {
                return false;
            } else {
            $(location).attr('href', url);
                return false;
            }
        } else {
            url = $(this).children('a').attr('href');
            $(location).attr('href', url);
            return false;
        }
    });

    console.log('JQuery catalog-menu is done!'); 
});