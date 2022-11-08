$(function() {
    const urlParams = new URLSearchParams(window.location.search);

    let path = window.location.pathname;
    let pagerPage = urlParams.get('page');
    let q = [];

    if (pagerPage === null) {
        pagerPage = 1;
        urlParams.set('page', 1);
    } else if (pagerPage > 5) {
        pagerPage = 5;
        urlParams.set('page', 5);
    }

    urlParams.forEach(function(value, key) {
        q.push(`${key}=${value}`);
    });

    if (q.length) {
        path = path.concat('?', q.join('&'));
    }

    if ($('.pagination').length) {
        if (pagerPage == 1) {
            $('.pagination-prev').hide();
        } else if (pagerPage == 5) {
            $('.pagination-next').hide();
        }

        $('.pagination .pagination-item').each(function(index) {
            if (pagerPage == index + 1) {
                if($('.pagination-prev').css('display') === 'inline-block') {
                    $('.pagination-prev').attr('href', path.replace(/page=\d+/, `page=${index}`));
                }
                if($('.pagination-next').css('display') === 'inline-block') {
                    $('.pagination-next').attr('href', path.replace(/page=\d+/, `page=${index + 2}`));
                }
                $(this).replaceWith(`<span class="pagination-item active">${pagerPage}</span>`);
            } else {
                $(this).attr('href', path.replace(/page=\d+/, `page=${index + 1}`));
            }
        })
    }

    console.log('JQuery pagination is done!'); 
});