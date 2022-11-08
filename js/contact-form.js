$(function() {
    $('#send-message').click(function(){
        let message = '';
        $('#contact-form .required').each(function() {
            if ($(this).val().trim() === '') {
                if ($(this).not('.error')) {
                    $(this).addClass('error');

                    message += '<p>Поле "' + $("label[for='" + $(this).attr('id') + "']").text().trim() + '" обязательно для заполнения</p>';
                }
            } else if ($(this).attr("type") !== undefined && $(this).attr("type") == 'email') {
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

        if ($('#contact-form .error').length) {
            message = '<div class="error">' + message + '</div>';
        } else {
            $(this).closest('form').find("input[type=text], input[type=email], textarea").val('');
            message = '<div class="info"><p>Ваше сообщение отправлено.</p><p>Спасибо!</p></div>';
        }

        $('#popup-content').append(message);
        $('#popup-wrapper').fadeIn(500);
    });

    console.log('JQuery contact form is done!'); 
});
