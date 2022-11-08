$(function() {
    let cart  = JSON.parse(localStorage.getItem('cart'));
    let total = 0;
    let minus, plus;

    if (cart) {
        $('.order-items').append('<div id="order-table-header" class="order-item"></div>');
        $('#order-table-header').append('<div class="order-item-header">Артикул</div>');
        $('#order-table-header').append('<div class="order-item-header">Наименование</div>');
        $('#order-table-header').append('<div class="order-item-header">Цена</div>');
        $('#order-table-header').append('<div class="order-item-header">Количество</div>');
        $('#order-table-header').append('<div class="order-item-header">Стоимость</div>');
        $('#order-table-header').append('<div class="order-item-header">Удалить</div>');

        for(let item of cart) {
            minus = 'active';
            plus  = 'active';

            if(item.quantity == 1) {
                minus = 'inactive';
            }

            $('.order-items').append(`<div id="product-${item.id}" data-product-id="${item.id}" class="order-item"></div>`);
            $('#product-' + item.id).append(`<div class="order-item-data item-sku">${item.sku}</div>`);
            $('#product-' + item.id).append(`<div class="order-item-data item-name">${item.name}</div>`);
            $('#product-' + item.id).append(`<div class="order-item-data item-price">${item.price}</div>`);
            $('#product-' + item.id).append('<div class="order-item-data item-quantity"><div class="cart-quantity"></div></div>');
            $('#product-' + item.id + ' .cart-quantity').append(`<span class="quantity-control control-minus ${minus}" data-control="minus">&minus;</span>`);
            $('#product-' + item.id + ' .cart-quantity').append(`<input type="text" class="quantity" value="${item.quantity}" readonly>`);
            $('#product-' + item.id + ' .cart-quantity').append(`<span class="quantity-control control-plus ${plus}" data-control="plus">&plus;</span>`);
            $('#product-' + item.id).append(`<div class="order-item-data item-cost">${item.price * item.quantity}</div>`);
            $('#product-' + item.id).append('<div class="order-item-data item-remove"><img src="css/images/trash-can.svg"></div>');

            total += item.price * item.quantity;
        }
        $('.order-items').append('<div id="order-table-footer" class="order-item"></div>');
        $('#order-table-footer').append('<div class="order-item-footer"></div>');
        $('#order-table-footer').append('<div class="order-item-footer"></div>');
        $('#order-table-footer').append('<div class="order-item-footer"></div>');
        $('#order-table-footer').append('<div class="order-item-footer"><b>Итого:</b></div>');
        $('#order-table-footer').append(`<div class="order-item-footer order-total-cost">${total}</div>`);
        $('#order-table-footer').append('<div class="order-item-footer"></div>');
    } else {
        cartIsEmpty();
    }

    $("#delivery-date").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd.mm.yy",
        firstDay: 1,
        dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        dayNamesShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Сбт"],
        dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        maxDate: "+14d",
        minDate: "+1d",
    });

    $("#delivery-date").datepicker('setDate', '+1d');

    $('#order-confirm').click(function(){
        let message = '';
        $('#order-form .required').each(function() {
            if ($(this).val().trim() === '') {
                if ($(this).not('.error')) {
                    $(this).addClass('error');

                    message += '<p>Поле "' + $("label[for='" + $(this).attr('id') + "']").text().trim() + '" обязательно для заполнения</p>';
                }
            } else if ($(this).hasClass('error')) {
                $(this).removeClass('error');
            }
        });

        $('input[type=email]').each(function() {
            if ($(this).val().trim().length) {
                if (!isEmail($(this).val().trim()) && $(this).not('.error')) {
                    $(this).addClass('error');
                    message += '<p>Поле "' + $("label[for='" + $(this).attr('id') + "']").text().trim() + '" должно содержать e-mail адрес</p>';
                }
            } else if ($(this).hasClass('error')) {
                $(this).removeClass('error');
            }
        });

        if (!$('#policy-agreements:checked').length) {
            message += 'Необходимо дать согласие на обработку персональных данных';
            $('#policy-agreements').not('.error').addClass('error');
        } else {
            $('#policy-agreements').removeClass('error');
        }

        if ($('#order-form .error').length) {
            message = '<div class="error">' + message + '</div>';
        } else {
            total = $('.order-items #order-table-footer .order-total-cost').text();
            message = `<div class="info"><p>Заказ номер ${orderNum()} успешно создан.</p><p>Сумма заказа: ${total} &#8381;</p><p>Спасибо за заказ!</p></div>`;

            $(this).closest('form').find("input[type=text], input[type=email], textarea").val('');
            $("#delivery-date").datepicker('setDate', '+1d');
            cartIsEmpty();
            localStorage.removeItem('cart');
        }

        $('#popup-content').append(message);
        $('#popup-wrapper').fadeIn(500);
    });

    $('.item-remove').click(function() {
        let product = $(this).parent('.order-item').data('product-id');
        let totalCost = $('.order-items #order-table-footer .order-total-cost');

        changeQuantity(product, 0);
        $('#product-' + product).remove();

        if (cart.length) {
            total = 0;
            $('.order-item .item-cost').each(function() {
                total = +$(this).text() + total;
            });
    
            totalCost.text(total);
        } else {
            cartIsEmpty();
            localStorage.removeItem('cart');
        }
    });

    $('.quantity-control').click(function() {
        let product   = $(this).parents('.order-item').data('product-id');
        let itemCost  = $(this).parents('.order-item').find('.item-cost');
        let quantity  = $(this).parent('.cart-quantity').find('.quantity');
        let totalCost = $('.order-items #order-table-footer .order-total-cost');

        if ($(this).data('control') === 'plus' && $(this).hasClass('active')) {
            quantity.val(+quantity.val() + 1);
            
            if (quantity.val() > 1 && $(this).parent('.cart-quantity').find('.control-minus.inactive')) {
                $(this).parent('.cart-quantity').find('.control-minus').removeClass('inactive');
                $(this).parent('.cart-quantity').find('.control-minus').not('.active').addClass('active');
            }

        } else if ($(this).data('control') === 'minus' && $(this).hasClass('active')) {
            quantity.val(+quantity.val() - 1);
            
            if (quantity.val() < 2) {
                $(this).removeClass('active');
                $(this).not('.inactive').addClass('inactive');
            }
        }

        itemCost.text(changeQuantity(product, quantity.val()));

        total = 0;
        $('.order-item .item-cost').each(function() {
            total = +$(this).text() + total;
        });

        totalCost.text(total);
    });

    function changeQuantity(product, quantity) {
        let cost = 0;

        if (cart) {
            for(const [index, item] of cart.entries()) {
                if (item.id == product) {
                    if (quantity > 0) {
                        item.quantity = +quantity;
                        cost = item.quantity * item.price;
                    } else {
                        cart.splice(index, 1);
                    }
                    break;
                }
            }

            localStorage.setItem('cart', JSON.stringify(cart));
        }

        return cost;
    }

    function orderNum() {
        let num = Math.floor(Math.random() * 100000);
        let orderNum = num + '';
    
        while(orderNum.length < 6) orderNum = '0' + orderNum;
    
        return orderNum;
    }
    
    function cartIsEmpty() {
        $('.order-form-wrapper').html('<h3>В корзине пока пусто</h3><p>Загляните в каталог, чтобы выбрать товары или найдите нужное в поиске</p><button class="page-go" data-link="catalog.html">Перейти в каталог</button>'); 
    }

    console.log('JQuery cart is done!'); 
});

