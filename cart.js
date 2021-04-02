let $addBtn = $( '.btn.add' );

let items =[]

let $titles = $( '.card' ).find( '.card-title' );
let $prices = $( '.card' ).find( '.card-text' );
let $images = $( '.card' ).find( '.img-fluid' );

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

let added = new Set();


$addBtn.click(function(e) {

    let btnIndex = $.inArray(e.target, $addBtn);

    
    if (added.has(btnIndex)) {

        console.log(btnIndex);

        let $multItem = $('.cart').find('.card-title');

        for (let i = 0; i < $multItem.length; i++) {

            if ($multItem.eq(i).text() == items[btnIndex].name) {
                let $amount = $multItem.eq(i).next().find('span');
                let numAmount = + $amount.text().slice(3);
                $amount.text(' x ' + (numAmount + 1));
            }
        }
    }

    else {

        console.log(added);
        console.log(btnIndex);

    let $chosenItem = $('<div></div>');
    

    $('<img>').attr('src', items[btnIndex].source)
              .addClass('img-fluid h-50')
              .appendTo($chosenItem);

    let $textInfo = $('<div></div>').addClass('card-body d-flex flex-column')
                                    .appendTo($chosenItem);

    $('<h4></h4>').text(items[btnIndex].name).addClass('card-title').appendTo($textInfo);
    $('<p class="card-text"></p>').text(items[btnIndex].price).appendTo($textInfo).append('<span> x 1</span>');
    $('<button[type="button"] class="btn delete btn-outline-primary">Delete</button>').appendTo($textInfo);


    $chosenItem.appendTo( '.cart' )
               .addClass('card mb-1 d-flex flex-row justify-content-between border w-50 align-items-center'); 
    
    };


    added.add(btnIndex);

})

$('.cart').click(function(e) {
   
    if ($(e.target).attr('class').includes('delete')) {

        $(e.target).closest('div.card').remove();

        let name = $(e.target).siblings('h4').text();
        let delIndex;

        for (let i = 0; i < items.length; i++) {

            if (name == items[i].name) {
                delIndex = i;
            }

        }

    added.delete(delIndex);

    }  
})
