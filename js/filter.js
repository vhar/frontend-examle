$(function() {
    const urlParams = new URLSearchParams(window.location.search);

    let costFrom =  urlParams.get('cost-from');
    let costTo   =  urlParams.get('cost-to');
    let isNew    =  urlParams.get('is-new');
    let inStock  =  urlParams.get('in-stock');

    $('.cost').slider({
        range: true,
        min: 0,
        max: 25000,
        step: 10,
        values: [0, 25000],
        classes: {
            'ui-slider-range': 'cost-range ui-corner-all'
        },
        slide: function(e, ui) {
            $('.range-form input:eq(' + ui.handleIndex + ')').val(ui.value);
        }
    });

    if (costFrom !== null) {
        $('.cost').slider('values', 0, costFrom);
    }
    
    if (costTo !== null) {
        $('.cost').slider('values', 1, costTo);
    }

    if (inStock !== null) {
        $('#in-stock').attr('checked', true);
    }

    if (isNew !== null) {
        $('#is-new').attr('checked', true);
    }

    $('#cost-from').val($('.cost').slider('values', 0));
    $('#cost-to').val($('.cost').slider('values', 1));


    $('#cost-from').change(function() {
        let val = $(this).val();
        if ( +val > +$('#cost-to').val()) {
            val = $('#cost-to').val();
            $(this).val(val);
        }
        $('.cost').slider('values', 0, val);
    });

    $('#cost-to').change(function() {
        let val = $(this).val();

        if ( +val < +$('#cost-from').val()) {
            val = $('#cost-from').val();
            $(this).val(val);
        }
        $('.cost').slider('values', 1, val);
    });    


    console.log('JQuery filter is done!'); 
});