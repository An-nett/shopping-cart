let $addBtn = $( '.btn.add' );

let items =[]

let $titles = $( '.card' ).find( '.card-title' );
let $prices = $( '.card' ).find( '.card-text' );
let $images = $( '.card' ).find( '.img-fluid' );



//построение массива с данными из карточек товаров
function makeArray() {
  for (let i = 0; i < $( '.card' ).length; i++) {
      let item = {
          name: $titles.eq(i).text(),
          price: $prices.eq(i).text().slice(1),
          source: $images.eq(i).attr('src'),
      }
      items.push(item);
  }
}

makeArray();


//сет с индексами тех карточек, которые лежат в корзине
let added = new Set();


//функционал на кнопку добавить в корзину
$addBtn.click(function(e) {

    let btnIndex = $.inArray(e.target, $addBtn);

    //если уже есть в корзине (умножение)
    if (added.has(btnIndex)) {

        let $multItem = $('.cart').find('.card-title');

        for (let i = 0; i < $multItem.length; i++) {

            if ($multItem.eq(i).text() == items[btnIndex].name) {
                let $amount = $multItem.eq(i).next().find('.amount');
                let numAmount = + $amount.text().slice(3);
                $amount.text(' x ' + (numAmount + 1));
            }
        }
    }

    //если добавляется в первый раз
    else {

    //карточка с товаром
    let $chosenItem = $('<div></div>');
    

    $('<img>').attr('src', items[btnIndex].source)
              .addClass('img-fluid h-50 w-50')
              .appendTo($chosenItem);

    
    //текстовая часть
    let $textInfo = $('<div></div>').addClass('card-body card-item d-flex flex-column')
                                    .appendTo($chosenItem);

    //заголовок
    $('<h4></h4>')
        .text(items[btnIndex].name)
        .addClass('card-title fs-5 text-wrap')
        .appendTo($textInfo);

    //цена
    $('<p class="card-text items-prices mb-0"></p>')
        .text(items[btnIndex].price)
        .appendTo($textInfo)
        .append('<span class = "amount"> x 1</span>');

    //плюс и минус
    $('<p class = "amount-change mb-0"></p>')
        .append('<button type="button" class = "btn d-inline-block ps-0 pe-0 plus link-success fs-1 text-decoration-none"> + </button>')
        .append('<button type="button" class = "btn d-inline-block ps-0 pe-0 minus link-danger fs-1 text-decoration-none"> - </button>')
        .appendTo($textInfo);

    //кнопка удалить
    $('<button type="button" class="btn delete btn-outline-primary">Delete</button>')
        .appendTo($textInfo);

    //куда добавить (перед общей суммой или впервые)
    if ($('.total').length == 1) {
        $chosenItem.insertBefore('.total');
    }

    else {
        $chosenItem.appendTo( '.cart' )
    }
   
    $chosenItem.addClass('card mb-1 d-flex flex-column flex-lg-row justify-content-between border align-items-center'); 
    
    };

    added.add(btnIndex);


    //если еще нет карточки с общей суммой
    if (($('.delete').length == 1) && ($('.amount').text() == " x 1") ) {

        let $totSum = $('<div class = "total bg-secondary text-white"></div>').appendTo('.cart');

        $('<p class = "fs-4 mb-0"> Total Sum: </p>')
            .appendTo($totSum).append($('<span class = "result fst-italic"></span>'));

        $('<p class = "fs-5 mb-0"> Taxes: </p>')
            .appendTo($totSum).append($('<span class = "taxes fst-italic"></span>'));

        $('<button type="button" class = "btn btn-light text-primary mt-1 mb-1 buy"> Buy Items </button>').appendTo($totSum);
    }

    calcSum();


})

//функционал для кнопок удаления
$('.cart').click(function(e) {
   
    if ($(e.target).attr('class').includes('delete')) {
        deleteCard(e.target);
    }  
})

//функция для удаления карточки из корзины
function deleteCard(target) {

    let name = $(target).closest('.card').find('h4').text();

    let delIndex;

    for (let i = 0; i < items.length; i++) {

        if (name == items[i].name) {
            delIndex = i;
        }

    }

$(target).closest('div.card').remove();
//удаляет карточку с общей суммой, если корзина пустая
    if ($('.delete').length < 1) {
        $('.total').remove();
    }

    added.delete(delIndex);
    calcSum();

}

let totalSum = 0;
//расчет общей суммы покупки
function calcSum() {
    let $prices = $('.items-prices');
    let curSum = 0;
    for (let i = 0; i < $prices.length; i++) {
        let calcPrice = $($prices[i]).text().split(' x ');
        let result = calcPrice[0] * calcPrice[1];
        curSum += result;
    }

    let tax = + (curSum * 0.1).toFixed(2);
    totalSum = + curSum.toFixed(2);

    $('.result').text(totalSum + '$');
    $('.taxes').text(tax + '$');

}

//функционал кнопок с плюсом и минусом
$('.cart').click(function(e) {

    if ($(e.target).hasClass('plus')) {
        let $toChange = $(e.target).parent().siblings('.card-text').find('.amount');
        let curVal = + $toChange.text().slice(3);
        $toChange.text(' x ' + (curVal + 1));
    }

    if ($(e.target).hasClass('minus')) {
        let $toChange = $(e.target).parent().siblings('.card-text').find('.amount');
        let curVal = + $toChange.text().slice(3);
        if (curVal > 1) {
            $toChange.text(' x ' + (curVal - 1));
        }
        else {
            deleteCard(e.target);
        }
       
    }
    calcSum();
})

let $cart;

//появление поля "заполнить информацию"
$('.cart').click(function(e) {

    if ($(e.target).hasClass('buy')) {
        $('.total-form').removeClass('d-none');

        $addBtn.attr('disabled', '');

        $cart = $(e.target).parent().parent('.cart');
        
        $('.cart').find('.delete').attr('disabled', '');
        $('.cart').find('.plus').addClass('disabled');
        $('.cart').find('.minus').addClass('disabled');
    
    }

    let deliv = + $('.form-check input:radio:checked').val()
        let final = totalSum + deliv;
        $('.result-del').text(final + '$');

})

//закрыть поле "заполнить информацию"
$('.btn-close').click(function() {
    $('.total-form').addClass('d-none');

    $addBtn.removeAttr('disabled')
    $('.cart').find('.delete').removeAttr('disabled', '');
    $('.cart').find('.plus').removeClass('disabled');
    $('.cart').find('.minus').removeClass('disabled');

    if ($('#floatingInputName').hasClass('is-invalid')) {
        $('#floatingInputName').removeClass('is-invalid');
    }
    if ($('#floatingInputAddress').hasClass('is-invalid')) {
        $('#floatingInputAddress').removeClass('is-invalid');
    }
})

$('.checkout').click(function() {

    let $inputName = $('#floatingInputName');
    let inputNameVal = $inputName.val();
    let $inputAddress = $('#floatingInputAddress');
    let inputAddressVal = $inputAddress.val()


    //сообщение о неверном или верном вводе
    if (typeof inputNameVal !== 'string' || inputNameVal == '') {
        $inputName.addClass('is-invalid');
    }
    else if ($inputName.hasClass('is-invalid')) {
        $inputName.removeClass('is-invalid');
        $inputName.addClass('is-valid');
    }
    else $inputName.addClass('is-valid');
    

    if (typeof inputAddressVal !== 'string' || inputAddressVal == '') {
        $inputAddress.addClass('is-invalid');
    }
    else if ($inputAddress.hasClass('is-invalid')) {
        $inputAddress.removeClass('is-invalid');
        $inputAddress.addClass('is-valid');
    }
    else $inputAddress.addClass('is-valid');
    
    //если поля заполнены корректно
    if ($inputName.hasClass('is-valid') && $inputAddress.hasClass('is-valid')) {
        $('.total-form').addClass('d-none');
        $addBtn.removeAttr('disabled')
        
        let $delBtn = $('.cart').find('.delete');
    
        for (let i = $delBtn.length; i >= 0; i--) {
            deleteCard($delBtn[i])
        }
    
        $('.cart').find('.total').remove();
        $('.success').removeClass('d-none');

        //сообщение об успехе
        setTimeout(function() {
           $('.success').addClass('d-none')
        }, 1000)

        //обнуление введенных данных
        $inputName.removeClass('is-valid');
        $inputAddress.removeClass('is-valid');
        $inputName.val('');
        $inputAddress.val('');
    } 
})

//сумма вместе с доставкой при выборе опций
$('.form-check').click(function(e) {
    if ($(e.target).hasClass('form-check-input')) {
        let deliv = + $('.form-check input:radio:checked').val()
        let final = totalSum + deliv;
        $('.result-del').text(final + '$');
    }
})



